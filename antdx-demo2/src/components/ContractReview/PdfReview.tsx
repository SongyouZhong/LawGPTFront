import React, { useState, useRef } from 'react';
import { Upload, Button, Drawer } from 'antd';
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
  const [pdfFile, setPdfFile] = useState<string | null>(null);
  const [drawerVisible, setDrawerVisible] = useState<boolean>(false);
  const [highlights, setHighlights] = useState<IHighlight[]>([]);
  const scrollViewerTo = useRef<(highlight: IHighlight) => void>(() => {});

  const onFileChange = (info: any) => {
    console.log("上传信息：", info);
    // 尝试从 info.file.originFileObj 获取文件对象
    const fileObj =
      info.file.originFileObj ||
      (info.fileList && info.fileList[0] && info.fileList[0].originFileObj);
    if (fileObj) {
      const fileUrl = URL.createObjectURL(fileObj);
      console.log("生成的 URL：", fileUrl);
      setPdfFile(fileUrl);
      setDrawerVisible(true); // 文件上传成功后打开抽屉
    } else {
      console.log("未获取到文件对象");
    }
  };

  // 添加新的高亮和批注
  const addHighlight = (highlight: Omit<IHighlight, 'id'>) => {
    const newHighlight: IHighlight = { ...highlight, id: String(Math.random()) };
    setHighlights((prev) => [...prev, newHighlight]);
  };

  return (
    <div>
      <Upload
        onChange={onFileChange}
        beforeUpload={() => false} // 阻止自动上传
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>上传 PDF</Button>
      </Upload>

      <Drawer
        title="PDF Review"
        placement="right"
        onClose={() => setDrawerVisible(false)}
        visible={drawerVisible}
        width="80vw" // 你可以根据需求调整宽度
        destroyOnClose
      >
        {pdfFile ? (
          <div style={{ height: '80vh', border: '1px solid #eee' }}>
            <PdfLoader url={pdfFile} beforeLoad={<div>加载中...</div>}>
              {(pdfDocument) => (
                <PdfHighlighter<IHighlight>
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  highlights={highlights}
                  onScrollChange={() => {}}
                  scrollRef={(scrollTo) => {
                    scrollViewerTo.current = scrollTo;
                  }}
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
                  highlightTransform={(highlight, index, setTip, hideTip) => (
                    <Popup
                      key={index}
                      popupContent={<div>{highlight.comment.text}</div>}
                      onMouseOver={() =>
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
        ) : (
          <p>当前没有上传 PDF 文件</p>
        )}
      </Drawer>
    </div>
  );
};

export default PdfReview;
