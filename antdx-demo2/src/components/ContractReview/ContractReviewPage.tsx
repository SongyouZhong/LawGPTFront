// src/components/ContractReview/ContractReviewPage.tsx
import React from 'react';
import PdfReview from './PdfReview';

const ContractReviewPage: React.FC = () => {
  return (
    <div style={{ padding: '16px' }}>
      {/* 此处可以加上“页面级别”的其他布局或说明 */}
      {/* <h2>合同审查</h2> */}
      <PdfReview />
    </div>
  );
};

export default ContractReviewPage;
