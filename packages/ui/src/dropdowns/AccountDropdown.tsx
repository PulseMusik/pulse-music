import React, { useState } from 'react'
import {
  ACCOUNTS_URL,
  ACCOUNTS_URL_ENDPOINTS,
  COPYRIGHT_LABEL,
  DEFAULT_PROFILE_PICTURE
} from '../../../lib/src/lib/constants'
import { FaCog, FaGlobeAfrica, FaInfo } from 'react-icons/fa'

import ChangeProfilePicture from '../dialogs/ChangeProfilePicture'

interface Props {
  children: React.ReactNode
  user: any
}

const AccountDropdown = ({ children, user }: Props) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  return (
    <div style={{ position: 'relative' }}>
      <div onClick={() => setIsOpen(!isOpen)}>{children}</div>

      {isOpen && (
        <div
          style={{
            position: 'absolute',
            right: 0,
            top: '150%',
            backgroundColor: '#fff',
            width: '320px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '12px',
            padding: '1rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            zIndex: 999
          }}
        >
          {/* Profile */}
          <div style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <ChangeProfilePicture data={user}>
              <img
                src={user?.pictures?.current?.url || DEFAULT_PROFILE_PICTURE}
                alt="Profile"
                style={{
                  height: '72px',
                  width: '72px',
                  borderRadius: '50%',
                  marginBottom: '0.5rem',
                  cursor: 'pointer'
                }}
              />
            </ChangeProfilePicture>
            <div style={{ fontWeight: '500', fontSize: '16px' }}>
              {user?.firstName ? `Hello, ${user?.firstName}!` : 'Hello!'}
            </div>
            <div style={{ fontSize: '14px', color: '#555' }}>{user?.email}</div>
            <a href={ACCOUNTS_URL!}>
              <button
                style={{
                  marginTop: '0.75rem',
                  backgroundColor: '#fff',
                  border: '1px solid #dadce0',
                  padding: '0.5rem 1.5rem',
                  borderRadius: '20px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  color: '#1a73e8',
                  fontWeight: 500
                }}
              >
                Manage your Pulse account
              </button>
            </a>
          </div>

          <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <a href={`${ACCOUNTS_URL!}${ACCOUNTS_URL_ENDPOINTS!.LANGUAGE!}`}>
              <button
                style={menuButtonStyle}
              >
                <div style={menuButtonContentStyle}>
                  <FaGlobeAfrica />
                  <span>Language</span>
                </div>
                <span style={menuTagStyle}>English</span>
              </button>
            </a>

            <div style={{ display: 'flex', gap: '0.5rem' }}>
              <a href={`${ACCOUNTS_URL!}${ACCOUNTS_URL_ENDPOINTS!.SETTINGS!}`} style={{ flex: 1 }}>
                <button style={menuButtonStyle}>
                  <div style={menuButtonContentStyle}>
                    <FaCog />
                    <span>Settings</span>
                  </div>
                </button>
              </a>
              <a href={`${ACCOUNTS_URL!}${ACCOUNTS_URL_ENDPOINTS!.INFO!}`} style={{ flex: 1 }}>
                <button style={menuButtonStyle}>
                  <div style={menuButtonContentStyle}>
                    <FaInfo />
                    <span>Info</span>
                  </div>
                </button>
              </a>
            </div>
          </div>

          <div style={{ textAlign: 'center', fontSize: '12px', color: '#888' }}>
            {COPYRIGHT_LABEL}
          </div>
        </div>
      )}
    </div>
  )
}

// Reusable button style
const menuButtonStyle: React.CSSProperties = {
  width: '100%',
  backgroundColor: '#f8f9fa',
  border: '1px solid #dadce0',
  borderRadius: '8px',
  padding: '0.5rem 1rem',
  fontSize: '14px',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  cursor: 'pointer'
}

const menuButtonContentStyle: React.CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem'
}

const menuTagStyle: React.CSSProperties = {
  fontSize: '12px',
  color: '#555'
}

export default AccountDropdown