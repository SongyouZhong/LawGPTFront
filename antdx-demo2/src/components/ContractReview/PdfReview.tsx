import React, { useState, useRef } from 'react';
import { Upload, Button } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import {
  PdfLoader,
  PdfHighlighter,
  Popup,
  Highlight,
  IHighlight,
} from 'react-pdf-highlighter';
import 'react-pdf-highlighter/dist/style.css';

const PdfReview: React.FC = () => {
  // 保存上传的 PDF 文件 URL
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  // 使用 react-pdf-highlighter 的原生 IHighlight 类型保存所有高亮和批注
  const [highlights, setHighlights] = useState<IHighlight[]>([]);
  // 用于保存滚动容器的引用
  const scrollViewerTo = useRef<(highlight: IHighlight) => void>(() => {});

  // 处理文件上传变化，状态变为 done 后获取文件 URL
  const onFileChange = (info: any) => {
    if (info.file.status === 'done') {
      const fileUrl = URL.createObjectURL(info.file.originFileObj);
      setPdfFile(fileUrl);
    }
  };

  // 添加新的高亮和批注（注意：此处传入的 highlight 不包含 id）
  const addHighlight = (highlight: Omit<IHighlight, 'id'>) => {
    const newHighlight: IHighlight = { ...highlight, id: String(Math.random()) };
    setHighlights((prev) => [...prev, newHighlight]);
  };

  return (
    <div>
      {/* 上传 PDF 按钮 */}
      <Upload
        onChange={onFileChange}
        beforeUpload={() => true} // 允许直接上传文件
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>上传 PDF</Button>
      </Upload>

      {/* 上传成功后显示 PDF */}
      {pdfFile && (
        <div style={{ height: '80vh', border: '1px solid #eee', marginTop: 16 }}>
          <PdfLoader url={pdfFile} beforeLoad={<div>加载中...</div>}>
            {(pdfDocument) => (
              <PdfHighlighter<IHighlight>
                pdfDocument={pdfDocument}
                enableAreaSelection={(event) => event.altKey}
                highlights={highlights}
                // 补充缺少的 onScrollChange 和 scrollRef 属性
                onScrollChange={() => {}}
                scrollRef={(scrollTo) => {
                  scrollViewerTo.current = scrollTo;
                }}
                // 用户完成选择后触发，展示“添加批注”按钮
                onSelectionFinished={(position, content, hideTipAndSelection) => (
                  <div
                    style={{
                      background: 'white',
                      padding: '8px',
                      borderRadius: '4px',
                    }}
                  >
                    <Button
                      type="primary"
                      onClick={() => {
                        // 新建高亮对象，注意 comment 字段需符合 { text, emoji } 结构
                        addHighlight({
                          position,
                          content,
                          comment: { text: '新批注', emoji: '💬' },
                        });
                        hideTipAndSelection();
                      }}
                    >
                      添加批注
                    </Button>
                  </div>
                )}
                // 自定义渲染每个高亮区域，当鼠标悬停时显示批注
                highlightTransform={(highlight, index, setTip, hideTip) => (
                  <Popup
                    key={index}
                    popupContent={<div>{highlight.comment.text}</div>}
                    onMouseOver={() =>
                      // setTip 的第二个参数需返回一个 React 元素
                      setTip(highlight, () => <div></div>)
                    }
                    onMouseOut={hideTip}
                  >
                    <Highlight
                      isScrolledTo={false}
                      position={highlight.position}
                      comment={highlight.comment}
                    />
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
