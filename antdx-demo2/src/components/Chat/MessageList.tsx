import React from "react";
import { Bubble } from "@ant-design/x";
import { GetProp } from "antd";

interface MessageListProps {
  items: NonNullable<GetProp<typeof Bubble.List, "items">>;
  roles: GetProp<typeof Bubble.List, "roles">;
  placeholderNode: React.ReactNode;
}

const MessageList: React.FC<MessageListProps> = ({
  items,
  roles,
  placeholderNode,
}) => {
  const placeholderItem: GetProp<typeof Bubble.List, "items">[0] = {
    key: "placeholder", // 确保有唯一的 key
    content: placeholderNode,
    variant: "borderless", // 确保 variant 是特定的字面量类型
  };

  const bubbleItems = items.length > 0 ? items : [placeholderItem];

  return <Bubble.List items={bubbleItems} roles={roles} />;
};

export default MessageList;
