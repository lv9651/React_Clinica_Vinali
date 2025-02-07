import React, { useState, useEffect, useContext } from 'react';
import { Layout, Menu, Button, Dropdown, Space, Avatar, Badge } from 'antd';
import { DesktopOutlined, UserOutlined, AuditOutlined, LogoutOutlined, DownOutlined, MenuUnfoldOutlined, MenuFoldOutlined, BellOutlined } from '@ant-design/icons';
import { Link, useNavigate } from 'react-router-dom';
import { SiGooglehome } from "react-icons/si";
import axios from 'axios';
import { UsuarioContext } from '../context/AuthContext';
import logo from '../assets/Vinali.png';


const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();

  const [collapsed, setCollapsed] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [notificationCount, setNotificationCount] = useState(0);
  const { user, logout ,dni, setUser,usuario} = useContext(UsuarioContext);

  const [documento, setDocumento] = useState('');


  const toggleCollapse = () => setCollapsed(!collapsed);
  const handleLogout = () => {
    logout();
    navigate('/');
  };

  
  const fetchNotifications = async () => {
    try {
      const response = await axios.get(`/api/Notifications/${dni}`);
      setNotifications(response.data);
      setNotificationCount(response.data.length);
    } catch (error) {
      console.error('Error al obtener notificaciones:', error);
    }
  };


  const clearNotifications = async () => {
    try {
      await axios.delete(`/api/Notifications/${dni}`);
      setNotifications([]);
      setNotificationCount(0);
    } catch (error) {
      console.error('Error al limpiar las notificaciones:', error);
    }
  };

  const markNotificationsAsRead = async () => {
    try {
      const notificationIds = notifications.filter(n => !n.is_read).map(n => n.id);
      if (notificationIds.length > 0) {
        await axios.post(`/api/Notifications/${dni}/read`, notificationIds);
        fetchNotifications();
      }
    } catch (error) {
      console.error('Error al marcar notificaciones como leídas:', error);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, [dni]);



  const userMenu = (
    <Menu style={{ boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)', borderRadius: '8px', width: '300px' }}>
      <Menu.Item key="4" icon={<LogoutOutlined />} onClick={handleLogout}>
        <span>Cerrar Sesión</span>
      </Menu.Item>
    </Menu>
  );

  const notificationMenu = (
    <Menu style={{ boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)', borderRadius: '8px', width: '400px' }}>
      <Menu.Item key="header" disabled>
        <span style={{ fontWeight: 'bold' }}>Notificaciones</span>
        <Button type="link" style={{ float: 'right', color: 'red' }} onClick={clearNotifications}>Limpiar</Button>
      </Menu.Item>
      {notifications.length > 0 ? (
        notifications.map(notification => (
          <Menu.Item key={notification.id}>
            {notification.message}
          </Menu.Item>
        ))
      ) : (
        <Menu.Item key="empty" disabled>No hay notificaciones</Menu.Item>
      )}
    </Menu>
  );

  const isAdmin = user && user.role === 'Administrador';
  const isEstandar = user && user.role === 'Estandar';

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#7FC5A8' }}>

      <Sider collapsible collapsed={collapsed} trigger={null} style={{ backgroundColor: '#7FC5A8' }}>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', padding: '10px', position: 'absolute', top: 10, left: collapsed ? 'calc(100% - 12px)' : 'calc(110% - 16px)', zIndex: 2 }}>
          <div onClick={toggleCollapse} style={{ cursor: 'pointer', fontSize: '24px', color: '#fff' }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>
        <Link to="/Bienvenida">
          <div className="logo" style={{ height: 40, margin: 20 }}>
            <img src={logo} alt="Logo" style={{ height: '130%' }} />
          </div>
        </Link>

        <Menu theme="dark" defaultSelectedKeys={['1']} mode="inline" style={{ backgroundColor: '#7FC5A8', color: '#fff' }}>
          <Menu.Item key="1" icon={<SiGooglehome />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>
            <Link to="/Bienvenida">Inicio</Link>
          </Menu.Item>
        </Menu>

        <Menu theme="dark" defaultSelectedKeys={['2']} mode="inline" style={{ backgroundColor: '#7FC5A8', color: '#fff' }}>
        <SubMenu
  key="docs"
  icon={<AuditOutlined />}
  title={<span style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>Reservar</span>} // Styling the title directly
  style={{ fontWeight: 'bold', fontSize: '10' }} // Optionally style SubMenu itself (though this may not apply to all elements)
>
          <Menu.Item key="3" icon={<SiGooglehome />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>
            <Link to="/S_per_familiar">Presencial</Link>
          </Menu.Item>
          <Menu.Item key="4" icon={<SiGooglehome />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>
            <Link to="/S_per_familiar">Teleconsulta</Link>
          </Menu.Item>
       
          </SubMenu>



          <SubMenu
  key="docs2"
  icon={<AuditOutlined />}
  title={<span style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>Citas</span>} // Styling the title directly
  style={{ fontWeight: 'bold', fontSize: '10' }} // Optionally style SubMenu itself (though this may not apply to all elements)
>
          <Menu.Item key="5" icon={<SiGooglehome />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>
            <Link to="/Cita_cliente">Mis Citas</Link>
          </Menu.Item>
          <Menu.Item key="6" icon={<SiGooglehome />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>
            <Link to="/Historial_clinico">Historial</Link>
          </Menu.Item>
       
          </SubMenu>
       
        </Menu>
      
      </Sider>
      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#7FC5A8', color: '#fff' }}>
          <div className="logo" />
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <Dropdown overlay={notificationMenu} trigger={['click']} onClick={markNotificationsAsRead}>
              <a onClick={e => e.preventDefault()} style={{ padding: '4px 15px', marginRight: '20px', fontSize: '18px', color: '#fff' }}>
                <Badge count={notificationCount} overflowCount={99}>
                  <BellOutlined />
                </Badge>
              </a>
            </Dropdown>
            <Dropdown overlay={userMenu}>
              <Space>
                <Avatar size="large" icon={<UserOutlined />} />
                <span style={{ marginLeft: 8 }}>  {usuario ? `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}` : 'Nombre no disponible'}
                </span>
                <DownOutlined style={{ color: '#fff' }} />
              </Space>

            </Dropdown>
          </div>
        </Header>
        <Content style={{ padding: '0 50px', marginTop: 40, backgroundColor: 'transparent', flex: 1 }}>
          <div style={{ padding: 24, minHeight: 380 }}>
            {children}
          </div>
        </Content>
        <Footer style={{ textAlign: 'center', backgroundColor: '#7FC5A8', color: '#fff' }}>
          L.V
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;