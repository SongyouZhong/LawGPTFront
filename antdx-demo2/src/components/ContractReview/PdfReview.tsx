import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
// import 'antd/dist/antd.css';
import type { RcFile } from 'antd/es/upload';
// 配置 pdfjs worker（注意 workerSrc 路径可能需根据项目实际情况调整）
// pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
pdfjs.GlobalWorkerOptions.workerSrc = `/pdfjs/build/pdf.worker.mjs`;


const PdfUploaderViewer = () => {
  // 保存上传的文件对象
  const [pdfFile, setPdfFile] = useState<RcFile | null>(null);
  // 保存 PDF 页数
  const [numPages, setNumPages] = useState<number | null>(null);

  // 上传之前，阻止自动上传行为，直接将文件保存到 state 中
  const beforeUpload = (file : RcFile) => {
    // 这里可以加入对文件类型和大小的校验
    setPdfFile(file);
    // 返回 false 阻止 antd 组件自动上传
    return false;
  };

  // PDF 加载成功后回调
  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };
  

  return (
    <div style={{ padding: '20px' }}>
      {/* 上传组件 */}
      <Upload beforeUpload={beforeUpload} showUploadList={false}>
        <Button icon={<UploadOutlined />}>点击上传 PDF 文件</Button>
      </Upload>

      {/* PDF 展示区域 */}
      {pdfFile && (
        <div style={{ marginTop: '20px' }}>
          <Document file={pdfFile} onLoadSuccess={onDocumentLoadSuccess}>
            {Array.from(new Array(numPages), (el, index) => (
              <Page key={`page_${index + 1}`} pageNumber={index + 1} />
            ))}
          </Document>
        </div>
      )}
    </div>
  );
};

export default PdfUploaderViewer;
