// src/components/common/RenderTitle.tsx
import React from 'react';
import { Space } from 'antd';

interface RenderTitleProps {
  icon: React.ReactElement;
  title: string;
}

const RenderTitle: React.FC<RenderTitleProps> = ({ icon, title }) => (
  <Space align="start">
    {icon}
    <span>{title}</span>
  </Space>
);

export default RenderTitle;
