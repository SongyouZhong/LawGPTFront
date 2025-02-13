import React from 'react';
import { Menu } from 'antd';
import { MailOutlined, AppstoreOutlined, SettingOutlined } from '@ant-design/icons';
import { Outlet, Link } from 'react-router-dom';
import useLayoutStyles from './useLayoutStyles';

const topMenuItems = [
  {
    key: 'home',
    icon: <MailOutlined />,
    label: <Link to="/">首页</Link>,
  },
  {
    key: 'contractReview',
    icon: <AppstoreOutlined />,
    label: <Link to="/contract-review">合同审查</Link>,
  },
  // {
  //   key: 'submenu',
  //   icon: <SettingOutlined />,
  //   label: '更多',
  //   children: [
  //     { key: 'setting:1', label: '选项一' },
  //     { key: 'setting:2', label: '选项二' },
  //   ],
  // },
];

const Layout: React.FC = () => {
  const { styles } = useLayoutStyles();

  return (
    <div className={styles.layout}>
      <header className={styles.header}>
        <div className={styles.logo}>
          <img
            src="https://mdn.alipayobjects.com/huamei_iwk9zp/afts/img/A*eco6RrQhxbMAAAAAAAAAAAAADgCCAQ/original"
            draggable={false}
            alt="logo"
          />
          <span>Ant Design X</span>
        </div>
        <Menu mode="horizontal" items={topMenuItems} />
      </header>
      <div className={styles.body}>
        {/* 核心：Outlet 用来渲染子路由页面 */}
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
