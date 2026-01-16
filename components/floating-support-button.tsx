"use client"

import { Button } from 'antd';
import { CustomerServiceOutlined } from '@ant-design/icons';
import { useRouter } from 'next/navigation';

export function FloatingSupportButton() {
  const router = useRouter();

  return (
    <Button
      type="primary"
      shape="circle"
      size="large"
      icon={<CustomerServiceOutlined style={{ fontSize: '24px' }} />}
      onClick={() => router.push('/support-chat')}
      style={{
        position: 'fixed',
        bottom: '90px',
        right: '20px',
        width: '56px',
        height: '56px',
        boxShadow: '0 4px 12px rgba(22, 119, 255, 0.4)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    />
  );
}
