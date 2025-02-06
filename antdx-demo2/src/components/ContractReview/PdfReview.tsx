import React, { useState } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import { PdfLoader, PdfHighlighter, Popup, Highlight } from 'react-pdf-highlighter';
import 'react-pdf-highlighter/dist/style.css';

interface HighlightType {
  id: string;
  position: any;
  content: any;
  comment: string;
}

const PdfReview: React.FC = () => {
  // 存储上传后的 PDF 文件 URL
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  // 存储用户添加的高亮和批注
  const [highlights, setHighlights] = useState<HighlightType[]>([]);

  // 处理文件上传变化，使用 antd 的 Upload 组件
  const onFileChange = (info: any) => {
    // 这里简单处理：当文件上传状态为 done 后读取文件对象
    if (info.file.status === 'done') {
      // 使用 URL.createObjectURL 将文件转换为本地 URL
      const fileUrl = URL.createObjectURL(info.file.originFileObj);
      setPdfFile(fileUrl);
    }
  };

  // 添加新的高亮批注
  const addHighlight = (highlight: HighlightType) => {
    setHighlights((prev) => [...prev, highlight]);
  };

  return (
    <div>
      {/* 上传 PDF 按钮 */}
      <Upload
        onChange={onFileChange}
        beforeUpload={() => true} // 允许直接上传文件（这里不做额外的上传处理）
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>上传 PDF</Button>
      </Upload>

      {/* 上传成功后显示 PDF */}
      {pdfFile && (
        <div style={{ height: '80vh', border: '1px solid #eee', marginTop: 16 }}>
          <PdfLoader url={pdfFile} beforeLoad={<div>加载中...</div>}>
            {(pdfDocument) => (
              <PdfHighlighter
                pdfDocument={pdfDocument}
                // 当按住 Alt 键时允许区域选择（可自定义触发条件）
                enableAreaSelection={(event) => event.altKey}
                // 已有的高亮批注数组
                highlights={highlights}
                // 当用户完成文本选择后展示“添加批注”按钮
                onSelectionFinished={(position, content, hideTipAndSelection) => (
                  <div style={{ background: 'white', padding: '8px', borderRadius: '4px' }}>
                    <Button
                      type="primary"
                      onClick={() => {
                        const newHighlight: HighlightType = {
                          id: String(Math.random()),
                          position,
                          content,
                          comment: '新批注', // 这里可以扩展为弹出输入框，让用户输入批注内容
                        };
                        addHighlight(newHighlight);
                        // 隐藏提示和选择区域
                        hideTipAndSelection();
                      }}
                    >
                      添加批注
                    </Button>
                  </div>
                )}
                // 渲染每个高亮区域，鼠标悬停时显示批注内容
                highlightTransform={(highlight, index, setTip, hideTip) => (
                  <Popup
                    key={index}
                    popupContent={<div>{highlight.comment}</div>}
                    onMouseOver={() => setTip(highlight)}
                    onMouseOut={hideTip}
                  >
                    <Highlight isScrolledTo={false} position={highlight.position} />
                  </Popup>
                )}
              />
            )}
          </PdfLoader>
        </div>
      )}
    </div>
  );
};

export default PdfReview;
