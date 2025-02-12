import React, { useState } from 'react';
import { Upload, Button, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { RcFile } from 'antd/es/upload/interface';
import ReactMarkdown from 'react-markdown'; // Import react-markdown

const API_KEY = 'app-NfLc5sZSrgyPfN81UJ9p1G75';

const PdfUploaderViewer = () => {
  const [pdfFile, setPdfFile] = useState<RcFile | null>(null);
  const [totalCheck, setTotalCheck] = useState<string>(''); // 用于存储总体审查结果
  const [partCheck, setPartCheck] = useState<string>(''); // 用于存储段落审查结果

  const beforeUpload = (file: RcFile) => {
    setPdfFile(file);
    return false;
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
          Authorization: `Bearer ${API_KEY}`, // 替换为实际的 API 密钥
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
          Authorization: `Bearer ${API_KEY}`, // 替换为实际的 API 密钥
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
          user: 'abc-123', // 替换为实际的用户标识
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
                    const totalCheckOutput = eventJson.data.outputs.totalcheck.output;
                    const partCheckOutput = eventJson.data.outputs.partcheck.output;
                    setTotalCheck(totalCheckOutput);
                    setPartCheck(partCheckOutput);
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
          <div
            style={{
              flex: 1,
              marginRight: '20px',
              borderRight: '1px solid #ccc',
              paddingRight: '20px',
              overflowY: 'auto',
            }}
          >
            {pdfFile && <h2>{pdfFile.name}</h2>}
            {/* 在此处添加 PDF 展示组件 */}
          </div>
          <div
            style={{
              flex: 1,
              paddingLeft: '20px',
              overflowY: 'auto',
            }}
          >
            <h3>审核信息反馈</h3>
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
              <h4>段落审查</h4>
              <ReactMarkdown>{partCheck}</ReactMarkdown>
            </div>
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
