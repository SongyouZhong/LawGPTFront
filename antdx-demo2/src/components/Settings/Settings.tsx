// src/components/Settings/Settings.tsx
import React, { useState } from 'react';
import { Button, Modal, Form, Input, Switch, message } from 'antd';
import { SettingOutlined } from '@ant-design/icons';
import useSettingsStyles from './useSettingsStyles';

interface SettingsProps {
  // 可根据需要添加其他 props，例如保存设置的回调
}

const Settings: React.FC<SettingsProps> = () => {
  const { styles } = useSettingsStyles();
  const [visible, setVisible] = useState(false);

  // 控制弹窗的显示
  const showModal = () => setVisible(true);
  const handleCancel = () => setVisible(false);

  // 处理“确定”操作，通常在此处保存设置
  const handleOk = () => {
    message.success('Settings saved!');
    setVisible(false);
  };

  return (
    <>
      {/* 设置按钮 */}
      <Button
        onClick={showModal}
        type="link"
        className={styles.settingsBtn}
        icon={<SettingOutlined />}
      >
        Settings
      </Button>
      
      {/* 弹窗 Modal */}
      <Modal
        title="Settings"
        visible={visible}
        onOk={handleOk}
        onCancel={handleCancel}
      >
        <Form layout="vertical">
          <Form.Item label="Username" name="username">
            <Input placeholder="Enter your username" />
          </Form.Item>
          <Form.Item label="Enable Notifications" name="notifications" valuePropName="checked">
            <Switch />
          </Form.Item>
          <Form.Item label="Email" name="email">
            <Input placeholder="Enter your email" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default Settings;
