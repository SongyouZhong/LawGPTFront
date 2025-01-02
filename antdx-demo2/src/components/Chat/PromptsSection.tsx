// src/components/Chat/PromptsSection.tsx
import React from 'react';
import { Prompts } from '@ant-design/x';
import { GetProp } from 'antd';

interface PromptsSectionProps {
  items: GetProp<typeof Prompts, 'items'>;
  onItemClick: GetProp<typeof Prompts, 'onItemClick'>;
}

const PromptsSection: React.FC<PromptsSectionProps> = ({ items, onItemClick }) => {
  return <Prompts items={items} onItemClick={onItemClick} />;
};

export default PromptsSection;
