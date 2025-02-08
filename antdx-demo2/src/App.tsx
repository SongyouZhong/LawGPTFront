import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout/Layout';
import Home from './pages/Home';

// 这是我们刚才新建的页面：
import ContractReviewPage from './components/ContractReview/ContractReviewPage';

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Layout 只保留顶栏等公共部分 */}
        <Route path="/" element={<Layout />}>
          {/* index 对应 / 根路由时渲染 Home */}
          <Route index element={<Home />} />

          {/* /contract-review 时渲染我们的合同审查页面 */}
          <Route path="contract-review" element={<ContractReviewPage />} />

          {/* 其他路由... */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
