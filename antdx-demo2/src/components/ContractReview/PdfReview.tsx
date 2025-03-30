import React, { useState, useEffect } from "react";
import { Upload, Button, message, Skeleton, Dropdown, Tooltip, Modal, Form, Input, List } from "antd";
import { 
  CloudUploadOutlined, 
  DownloadOutlined,
  HomeOutlined,
  InsertRowLeftOutlined,
  LayoutOutlined,
  CheckSquareOutlined,
  EyeOutlined,
  CommentOutlined,
  PlusOutlined,
  MessageOutlined,
  AppstoreOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { RcFile } from "antd/es/upload/interface";
import ReactMarkdown from "react-markdown";
import { Document, Page, pdfjs } from "react-pdf";
import "react-pdf/dist/esm/Page/AnnotationLayer.css";
import "react-pdf/dist/esm/Page/TextLayer.css";

// 将 workerSrc 设置为本地路径，注意 process.env.PUBLIC_URL 通常对应 public 目录
pdfjs.GlobalWorkerOptions.workerSrc =
`//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// 定义工具栏项
const toolbarItems = [
  {
    key: 'home',
    icon: <HomeOutlined />,
    label: '开始',
    children: [
      { key: 'new', label: '新建' },
      { key: 'open', label: '打开' },
      { key: 'save', label: '保存' },
    ]
  },
  {
    key: 'insert',
    icon: <InsertRowLeftOutlined />,
    label: '插入',
    children: [
      { key: 'table', label: '表格' },
      { key: 'image', label: '图片' },
      { key: 'shape', label: '形状' },
    ]
  },
  {
    key: 'layout',
    icon: <LayoutOutlined />,
    label: '页面布局',
    children: [
      { key: 'margin', label: '页边距' },
      { key: 'orientation', label: '方向' },
      { key: 'size', label: '大小' },
    ]
  },
  {
    key: 'review',
    icon: <CheckSquareOutlined />,
    label: '审阅',
    children: [
      { key: 'track', label: '修订' },
      { key: 'comment', label: '批注' },
      { key: 'compare', label: '比较' },
    ]
  },
  {
    key: 'view',
    icon: <EyeOutlined />,
    label: '视图',
    children: [
      { key: 'zoom', label: '缩放' },
      { key: 'grid', label: '网格' },
      { key: 'ruler', label: '标尺' },
    ]
  }
];

interface Comment {
  id: string;
  page: number;
  content: string;
  position: { x: number; y: number };
  createdAt: Date;
}

interface Annotation {
  id: string;
  page: number;
  type: 'highlight' | 'underline' | 'strikethrough';
  color: string;
  position: { x: number; y: number };
  text: string;
  commentId?: string;  // Optional property to link annotation with a comment
}

const PdfUploaderViewer = () => {
  const [pdfFile, setPdfFile] = useState<RcFile | null>(null);
  const [totalCheck, setTotalCheck] = useState<string>("");
  const [numPages, setNumPages] = useState<number>(0);
  const [activeTab, setActiveTab] = useState<string>("home");
  const [showComments, setShowComments] = useState<boolean>(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [annotations, setAnnotations] = useState<Annotation[]>([]);
  const [isCommentModalVisible, setIsCommentModalVisible] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [commentForm] = Form.useForm();

  // 从 localStorage 加载保存的注释和标注
  useEffect(() => {
    if (pdfFile) {
      const savedComments = localStorage.getItem(`comments_${pdfFile.name}`);
      const savedAnnotations = localStorage.getItem(`annotations_${pdfFile.name}`);
      if (savedComments) {
        setComments(JSON.parse(savedComments));
      }
      if (savedAnnotations) {
        setAnnotations(JSON.parse(savedAnnotations));
      }
    }
  }, [pdfFile]);

  // 保存注释和标注到 localStorage
  useEffect(() => {
    if (pdfFile) {
      localStorage.setItem(`comments_${pdfFile.name}`, JSON.stringify(comments));
      localStorage.setItem(`annotations_${pdfFile.name}`, JSON.stringify(annotations));
    }
  }, [comments, annotations, pdfFile]);

  const beforeUpload = (file: RcFile) => {
    setPdfFile(file);
    return false;
  };

  const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
    setNumPages(numPages);
  };

  const handleDownload = () => {
    if (!pdfFile) {
      message.error("没有可下载的文件");
      return;
    }
    const url = URL.createObjectURL(pdfFile);
    const link = document.createElement('a');
    link.href = url;
    link.download = pdfFile.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleToolbarClick = (key: string) => {
    setActiveTab(key);
    // 处理工具栏点击事件
    switch (key) {
      case 'new':
        // 实现新建功能
        break;
      case 'open':
        // 实现打开功能
        break;
      case 'save':
        // 实现保存功能
        break;
      // ... 其他工具栏项的处理
    }
  };

  const commentMenuItems = [
    {
      key: 'insert',
      icon: <PlusOutlined />,
      label: '插入批注',
    },
    {
      key: 'display',
      icon: <MessageOutlined />,
      label: '显示批注框',
    },
    {
      key: 'panel',
      icon: <AppstoreOutlined />,
      label: '显示完整批注面板',
    },
  ];

  const handleCommentMenuClick = ({ key }: { key: string }) => {
    switch (key) {
      case 'insert':
        // 实现插入批注的逻辑
                  break;
      case 'display':
        // 实现显示批注框的逻辑
                  break;
      case 'panel':
        setShowComments(!showComments);
                  break;
    }
  };

  const handleAddComment = (page: number, position: { x: number; y: number }) => {
    setCurrentPage(page);
    setIsCommentModalVisible(true);
    commentForm.setFieldsValue({ page, position });
  };

  const handleCommentSubmit = async () => {
    try {
      const values = await commentForm.validateFields();
      const newComment: Comment = {
        id: Date.now().toString(),
        page: values.page,
        content: values.content,
        position: values.position,
        createdAt: new Date(),
      };
      setComments([...comments, newComment]);
      setIsCommentModalVisible(false);
      commentForm.resetFields();
      } catch (error) {
      console.error('Failed to submit comment:', error);
    }
  };

  // const handleAddAnnotation = (page: number, type: Annotation['type'], color: string, text: string, position: { x: number; y: number }) => {
  //   const newAnnotation: Annotation = {
  //     id: Date.now().toString(),
  //     page,
  //     type,
  //     color,
  //     text,
  //     position,
  //   };
  //   setAnnotations([...annotations, newAnnotation]);
  // };

  const handleDeleteComment = (commentId: string) => {
    // Delete the comment
    setComments(comments.filter(comment => comment.id !== commentId));
    handleDeleteAnnotation(commentId)
    // Also delete any associated annotations
    setAnnotations(annotations.filter(annotation => annotation.commentId !== commentId));
  };

  const handleDeleteAnnotation = (annotationId: string) => {
    // Delete the annotation
    setAnnotations(annotations.filter(annotation => annotation.id !== annotationId));
    
    // If this annotation was associated with a comment, also delete the comment
    const annotationToDelete = annotations.find(a => a.id === annotationId);
    if (annotationToDelete?.commentId) {
      setComments(comments.filter(comment => comment.id !== annotationToDelete.commentId));
    }
  };

  const renderToolbar = () => {
    if (!pdfFile) return null;

    return (
      <>
        {/* Header Tab Bar */}
        <div style={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          padding: "10px 20px",
          marginBottom: "10px"
        }}>
          <div style={{ fontSize: "16px", fontWeight: "bold" }}>
            {pdfFile.name}
          </div>
          <Button 
            type="primary" 
            icon={<DownloadOutlined />} 
            onClick={handleDownload}
          >
            下载文档
          </Button>
        </div>

        {/* Toolbar */}
        <div style={{ 
          display: "flex", 
          gap: "10px",
          padding: "10px",
          borderBottom: "1px solid #f0f0f0",
          marginBottom: "10px"
        }}>
          {toolbarItems.map(item => (
            <Tooltip key={item.key} title={item.label}>
              <Button
                type={activeTab === item.key ? "primary" : "text"}
                icon={item.icon}
                onClick={() => handleToolbarClick(item.key)}
              />
            </Tooltip>
          ))}
          <div style={{ flex: 1 }} />
          <Dropdown 
            menu={{ 
              items: commentMenuItems, 
              onClick: handleCommentMenuClick 
            }}
            placement="bottomRight"
          >
            <Button icon={<CommentOutlined />}>
              批注
            </Button>
          </Dropdown>
        </div>
      </>
    );
  };

  const renderPdfContent = () => {
    if (!pdfFile) return null;

    return (
      <div style={{ flex: 1, display: "flex", gap: "20px" }}>
        {/* 左侧展示 PDF 内容 */}
        <div
          style={{
            flex: 1,
            marginRight: "20px",
            borderRight: "1px solid #ccc",
            paddingRight: "20px",
            overflowY: "auto",
          }}
        >
          <Document
            file={pdfFile}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadError={(error) => console.error("加载 PDF 失败: ", error)}
          >
            {Array.from(new Array(numPages), (el, index) => (
              <div key={`page_${index + 1}`} style={{ position: 'relative' }}>
                <Page 
                  pageNumber={index + 1}
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    handleAddComment(index + 1, { x, y });
                  }}
                />
                {/* 渲染注释 */}
                {comments
                  .filter(comment => comment.page === index + 1)
                  .map(comment => (
                    <div
                      key={comment.id}
                      style={{
                        position: 'absolute',
                        left: comment.position.x,
                        top: comment.position.y,
                        background: '#fff',
                        border: '1px solid #d9d9d9',
                        borderRadius: '4px',
                        padding: '8px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span>批注</span>
                        <Button 
                          type="text" 
                          icon={<DeleteOutlined />}
                          onClick={() => handleDeleteComment(comment.id)}
                        />
                      </div>
                      <p>{comment.content}</p>
                    </div>
                  ))}
                {/* 渲染标注 */}
                {annotations
                  .filter(annotation => annotation.page === index + 1)
                  .map(annotation => (
                    <div
                      key={annotation.id}
                      style={{
                        position: 'absolute',
                        left: annotation.position.x,
                        top: annotation.position.y,
                        background: annotation.color,
                        opacity: 0.3,
                        padding: '4px',
                        borderRadius: '2px',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      <span>{annotation.text}</span>
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteAnnotation(annotation.id)}
                        style={{ padding: '0 4px', height: 'auto' }}
                      />
                    </div>
                  ))}
              </div>
            ))}
          </Document>
        </div>

        {/* 右侧展示审核反馈信息和批注面板 */}
        <div
          style={{
            flex: 1,
            paddingLeft: "20px",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h3>审核信息反馈</h3>
          {totalCheck ? (
            <div
              style={{
                whiteSpace: "pre-wrap",
                wordWrap: "break-word",
                overflowY: "auto",
                flex: 1,
              }}
            >
              <h4>总体审查</h4>
              <ReactMarkdown>{totalCheck}</ReactMarkdown>
            </div>
          ) : (
            <Skeleton active paragraph={{ rows: 10 }} />
          )}

          {/* 批注面板 */}
          {showComments && (
            <div style={{ 
              marginTop: "20px",
              borderTop: "1px solid #f0f0f0",
              paddingTop: "20px"
            }}>
              <h3>批注列表</h3>
              <List
                dataSource={comments}
                renderItem={comment => (
                  <List.Item
                    actions={[
                      <Button 
                        type="text" 
                        icon={<DeleteOutlined />}
                        onClick={() => handleDeleteComment(comment.id)}
                      />
                    ]}
                  >
                    <List.Item.Meta
                      title={`第 ${comment.page} 页`}
                      description={comment.content}
                    />
                  </List.Item>
                )}
              />
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: "20px", width: "90vw", height: "100vh", display: "flex", flexDirection: "column" }}>
      {renderToolbar()}
      
      {!pdfFile ? (
        <div
          style={{
            padding: "40px",
            textAlign: "center",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            flexDirection: "column",
            width: "100%",
          }}
        >
          <h1
            style={{
              fontSize: "24px",
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <span
              style={{
                background: "#4CAF50",
                color: "#fff",
                padding: "5px 10px",
                borderRadius: "50%",
              }}
            >
              📄
            </span>
            合同审查
          </h1>
          <p style={{ color: "#666", fontSize: "16px" }}>
            精准又详细的合同审查
          </p>

          <div
            style={{
              marginTop: "30px",
              background: "#f8fafd",
              padding: "40px",
              borderRadius: "8px",
              border: "1px solid #e0e0e0",
              maxWidth: "600px",
              marginLeft: "auto",
              marginRight: "auto",
              textAlign: "center",
              width: "100%",
            }}
          >
            <Upload beforeUpload={beforeUpload} showUploadList={false}>
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  cursor: "pointer",
                  padding: "20px",
                  borderRadius: "8px",
                  background: "#fff",
                  border: "1px dashed #d9d9d9",
                }}
              >
                <CloudUploadOutlined
                  style={{ fontSize: "24px", color: "#1890ff" }}
                />
                <p style={{ fontSize: "16px", color: "#333" }}>
                  点击上传或拖拽合同文件至此处
                </p>
                <p style={{ fontSize: "14px", color: "#888" }}>
                  目前仅支持 PDF，文件最大不超过 10M
                </p>
              </div>
            </Upload>
          </div>
        </div>
      ) : (
        renderPdfContent()
      )}

      {/* 批注添加模态框 */}
      <Modal
        title="添加批注"
        open={isCommentModalVisible}
        onOk={handleCommentSubmit}
        onCancel={() => setIsCommentModalVisible(false)}
      >
        <Form form={commentForm} layout="vertical">
          <Form.Item
            name="content"
            label="批注内容"
            rules={[{ required: true, message: '请输入批注内容' }]}
          >
            <Input.TextArea rows={4} />
          </Form.Item>
          <Form.Item name="page" hidden>
            <Input />
          </Form.Item>
          <Form.Item name="position" hidden>
            <Input />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default PdfUploaderViewer;
