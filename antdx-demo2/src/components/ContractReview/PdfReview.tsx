import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import type { RcFile } from 'antd/es/upload';

// 配置 pdfjs worker（根据项目实际情况调整路径）
pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/build/pdf.worker.mjs`;

const PdfUploaderViewer = () => {
  // 保存上传的文件对象
  const [pdfFile, setPdfFile] = useState<RcFile | null>(null);
  // 保存 PDF 页数
  const [numPages, setNumPages] = useState<number | null>(null);

  // 上传之前，阻止自动上传行为，将文件存入 state 中
  const beforeUpload = (file: RcFile) => {
    setPdfFile(file);
    return false;
  };

  // PDF 加载成功后的回调
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  return (
    <div style={{ padding: '20px' }}>
      {/* 未上传时显示上传组件 */}
      {!pdfFile && (
        <Upload beforeUpload={beforeUpload} showUploadList={false}>
          <Button icon={<UploadOutlined />}>点击上传 PDF 文件</Button>
        </Upload>
      )}

      {/* 上传后显示左右两栏布局 */}
      {pdfFile && (
        <div
          style={{
            display: 'flex',
            marginTop: '20px',
            height: '80vh'
          }}
        >
          {/* 左侧：PDF 展示区域 */}
          <div
            style={{
              flex: 1,
              marginRight: '20px',
              borderRight: '1px solid #ccc',
              paddingRight: '20px',
              overflowY: 'auto'
            }}
          >
            {/* 在 PDF 展示区域上方添加文件名称 */}
            {pdfFile && <h2>{pdfFile.name}</h2>}
            <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
              {Array.from(new Array(numPages), (el, index) => (
                <Page key={`page_${index + 1}`} pageNumber={index + 1} />
              ))}
            </Document>
          </div>
          {/* 右侧：审核信息反馈区域 */}
          <div
            style={{
              flex: 1,
              paddingLeft: '20px',
              overflowY: 'auto'
            }}
          >
            <h3>审核信息反馈</h3>
            <p>
              这里可以展示各种审核信息、评论、反馈等内容。如果内容较多，右侧区域会自动出现垂直滚动条。
            </p>
            {Array.from({ length: 30 }).map((_, index) => (
              <div key={index} style={{ marginBottom: '10px' }}>
                <strong>审核反馈 {index + 1}:</strong> 这里是审核意见的示例内容...
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PdfUploaderViewer;
