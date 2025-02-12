import React, { useState } from 'react';
import { Upload, Button, message, Skeleton  } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload/interface';
import ReactMarkdown from 'react-markdown';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

// 将 workerSrc 设置为本地路径，注意 process.env.PUBLIC_URL 通常对应 public 目录
pdfjs.GlobalWorkerOptions.workerSrc = process.env.PUBLIC_URL + '/pdfjs/build/pdf.worker.mjs';

const API_KEY = 'app-LwZXrp7TMMTeL5u0nTADQeeg';

const PdfUploaderViewer = () => {
  const [pdfFile, setPdfFile] = useState<RcFile | null>(null);
  const [totalCheck, setTotalCheck] = useState<string>('');
  const [numPages, setNumPages] = useState<number>(0);

  const beforeUpload = (file: RcFile) => {
    setPdfFile(file);
    return false;
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const startWorkflow = async () => {
    if (!pdfFile) {
      message.error('请先上传 PDF 文件');
      return;
    }

    const formData = new FormData();
    formData.append('file', pdfFile);
    formData.append('user', 'abc-123'); // 替换为实际的用户标识

    try {
      const uploadResponse = await fetch('http://localhost/v1/files/upload', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        throw new Error('文件上传失败');
      }

      const { id: uploadFileId } = await uploadResponse.json();

      const workflowResponse = await fetch('http://localhost/v1/workflows/run', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${API_KEY}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs: {
            user_input_file: {
              transfer_method: 'local_file',
              upload_file_id: uploadFileId,
              type: 'document',
            },
            part: "乙方",
          },
          response_mode: 'streaming',
          user: 'abc-123',
        }),
      });

      if (!workflowResponse.ok) {
        throw new Error('工作流启动失败');
      }

      const reader = workflowResponse.body?.getReader();
      if (!reader) {
        throw new Error('无法读取工作流响应');
      }

      const decoder = new TextDecoder();
      let done = false;
      let result = '';

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        result += decoder.decode(value, { stream: true });
      }

      try {
        const events = result.split('\n\n');
        for (const event of events) {
          if (event) {
            const jsonString = event.replace(/^data:\s*/, '');
            if (jsonString === '"ping"') {
              continue;
            }
            try {
              const eventJson = JSON.parse(jsonString);
              const eventType = eventJson.event;
              switch (eventType) {
                case 'workflow_started':
                  console.log('工作流已启动');
                  break;
                case 'node_started':
                  break;
                case 'node_finished':
                  break;
                case 'workflow_finished':
                  if (eventJson.data.outputs) {
                    console.log("-------workflow_finished outputs-----------")
                    console.log(eventJson.data.outputs)
                    const totalCheckOutput = eventJson.data.outputs.text;
                    setTotalCheck(totalCheckOutput);
                  }
                  break;
                case 'ping':
                  break;
                default:
                  console.log(`未知事件类型: ${event}`);
              }
            } catch (parseError) {
              console.error('JSON 解析错误:', parseError);
              continue;
            }
          }
        }
      } catch (error) {
        console.error('处理工作流结果时发生错误:', error);
        message.error('处理工作流结果时发生错误');
      }

      console.log('工作流结果:', result);
    } catch (error: unknown) {
      if (error instanceof Error) {
        message.error(error.message);
      } else {
        message.error('发生了未知错误');
      }
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      {!pdfFile && (
        <Upload beforeUpload={beforeUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />}>点击上传 PDF 文件</Button>
        </Upload>
      )}

      {pdfFile && (
        <div
          style={{
            display: 'flex',
            marginTop: '20px',
            height: '80vh',
          }}
        >
          {/* 左侧展示 PDF 内容 */}
          <div
            style={{
              flex: 1,
              marginRight: '20px',
              borderRight: '1px solid #ccc',
              paddingRight: '20px',
              overflowY: 'auto',
              minWidth: '45%'
            }}
          >
            <h2>{pdfFile.name}</h2>
            <Document
              file={pdfFile}
              onLoadSuccess={onDocumentLoadSuccess}
              onLoadError={(error) => console.error('加载 PDF 失败: ', error)}
            >
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>

          {/* 右侧展示审核反馈信息 */}
          <div
            style={{
              flex: 1,
              paddingLeft: '20px',
              overflowY: 'auto',
              minWidth: '45%'
            }}
          >
            <h3>审核信息反馈</h3>
            {totalCheck ? (
              <div
                style={{
                  whiteSpace: 'pre-wrap',
                  wordWrap: 'break-word',
                  overflowY: 'auto',
                  height: '70vh',
                }}
              >
                <h4>总体审查</h4>
                <ReactMarkdown>{totalCheck}</ReactMarkdown>
              </div>
            ) : (
              <Skeleton active paragraph={{ rows: 10 }} />)}
          </div>
        </div>
      )}

      {pdfFile && (
        <Button
          type="primary"
          onClick={startWorkflow}
          style={{ marginTop: '20px' }}
        >
          启动工作流
        </Button>
      )}
    </div>
  );
};

export default PdfUploaderViewer;
