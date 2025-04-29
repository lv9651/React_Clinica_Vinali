import React, { useState, useContext } from 'react';
import { Layout, Menu, Dropdown, Space, Avatar, Drawer } from 'antd';
import { SiGooglehome, SiOdnoklassniki, SiAudacity, SiDask, SiDatabricks } from "react-icons/si";
import { UsuarioContext } from '../context/AuthContext';
import logo from '../assets/Vinali.png';
import { Link, useNavigate } from 'react-router-dom';
import { DownOutlined, MenuUnfoldOutlined, MenuFoldOutlined, UserOutlined } from '@ant-design/icons';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../CSS/Menu.css';
import { FaWhatsapp, FaEnvelope } from 'react-icons/fa';
import { ImAidKit } from "react-icons/im";

const { Header, Content, Footer, Sider } = Layout;
const { SubMenu } = Menu;

const MainLayout = ({ children }) => {
  const navigate = useNavigate();
  const { user, logout, usuario } = useContext(UsuarioContext);
  const [collapsed, setCollapsed] = useState(false);
  const [openKeys, setOpenKeys] = useState([]); // Estado que maneja qué submenú está abierto
  const [drawerVisible, setDrawerVisible] = useState(false); // Estado para controlar el Drawer en dispositivos móviles

  const toggleCollapse = () => setCollapsed(!collapsed);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  // Cambia el comportamiento de los submenús para que solo se abra un submenú a la vez
  const handleOpenChange = (keys) => {
    setOpenKeys(keys.length ? [keys[keys.length - 1]] : []);
  };

  // Cambia el comportamiento de los submenús en pantallas pequeñas (móviles)
  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  const userMenu = (
    <Menu
      style={{
        boxShadow: '0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 9px 28px 8px rgba(0, 0, 0, 0.05)',
        borderRadius: '4px',
        width: '100%',
      }}
    >
      <Menu.Item
        key="4"
        icon={<DownOutlined />}
        onClick={handleLogout}
        className="menu-item"
      >
        <span>Cerrar Sesión</span>
      </Menu.Item>
    </Menu>
  );

  return (
    <Layout style={{ minHeight: '100vh', backgroundColor: '#15afc6' }}>
      <Sider collapsible collapsed={collapsed} trigger={null} style={{ backgroundColor: '#15afc6' }} width={200}>
        {/* Icono de menú en dispositivos móviles */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            padding: '10px',
            position: 'absolute',
            top: 10,
            left: collapsed ? 'calc(100% - 12px)' : 'calc(110% - 50px)',
            zIndex: 2,
            transition: 'left 0.3s ease',
          }}
        >
          <div onClick={toggleCollapse} style={{ cursor: 'pointer', fontSize: '24px', color: '#fff' }}>
            {collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
          </div>
        </div>

        <Link to="/Bienvenida">
          <div
            className="logo"
            style={{
              height: 40,
              margin: 20,
              transition: 'all 0.3s ease',
              width: collapsed ? '40px' : '100%',
              overflow: 'hidden',
            }}
          >
            <img
              src={logo}
              alt="Logo"
              style={{
                height: '100%',
                width: 'auto',
                transition: 'all 0.3s ease',
                display: collapsed ? 'none' : 'block',
              }}
            />
          </div>
        </Link>

        {/* Menú en dispositivos de escritorio */}
        <Menu theme="dark" mode="inline" style={{ backgroundColor: '#15afc6', color: '#fff' }} openKeys={openKeys} onOpenChange={handleOpenChange}>
          <Menu.Item key="1" icon={<SiGooglehome />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>
            <Link to="/Bienvenida">Inicio</Link>
          </Menu.Item>

          <SubMenu key="docs" icon={<SiOdnoklassniki />} title={<span style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>Reservar</span>}>

          <Menu.Item 
    key="3" 
    icon={<ImAidKit />} 
    style={{ fontWeight: 'bold', fontSize: '12px', color: '#15afc6', backgroundColor: '#ffffff' }} // Fondo blanco para 'Presencial'
  >
    <Link to="/S_per_familiar?tipo=1">Presencial</Link>
  </Menu.Item>
  <Menu.Item 
    key="4" 
    icon={<SiAudacity />} 
    style={{ fontWeight: 'bold', fontSize: '12px', color: '#15afc6', backgroundColor: '#ffffff' }} // Fondo blanco para 'Teleconsulta'
  >
    <Link to="/S_per_familiar?tipo=2">Teleconsulta</Link>
  </Menu.Item>

          </SubMenu>

          
            <Menu.Item key="5" icon={<SiDatabricks />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#fff' }}>
              <Link to="/Cita_cliente">Mis Citas</Link>
            </Menu.Item>
      
        </Menu>

        {/* Menú para dispositivos móviles (Drawer) */}
        <Drawer
          title="Menú"
          placement="left"
          closable={false}
          onClose={closeDrawer}
          visible={drawerVisible}
          width={250}
        >
          <Menu theme="light" mode="inline">
            <Menu.Item key="1" icon={<SiGooglehome />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#000' }}>
              <Link to="/Bienvenida">Inicio</Link>
            </Menu.Item>

            <SubMenu key="docs" icon={<SiOdnoklassniki />} title={<span style={{ fontWeight: 'bold', fontSize: '12px', color: '#000' }}>Reservar</span>}>
              <Menu.Item key="3" icon={<ImAidKit />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#000' }}>
                <Link to="/S_per_familiar?tipo=1">Presencial</Link>
              </Menu.Item>
              <Menu.Item key="4" icon={<SiAudacity />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#000' }}>
                <Link to="/S_per_familiar?tipo=2">Teleconsulta</Link>
              </Menu.Item>
            </SubMenu>

              <Menu.Item key="5" icon={<SiDatabricks />} style={{ fontWeight: 'bold', fontSize: '12px', color: '#000' }}>
                <Link to="/Cita_cliente">Mis Citas</Link>
              </Menu.Item>
        
          </Menu>
        </Drawer>
      </Sider>

      <Layout className="site-layout">
        <Header className="site-layout-background" style={{ padding: '0 24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#15afc6', color: '#fff' }}>
          <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
            {/* Aquí aseguramos que el logo siempre se alinee a la izquierda */}
          </div>

          {/* Avatar y nombre alineados a la derecha */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
            <Dropdown overlay={userMenu}>
              <Space className="dropdown-space">
                {/* Avatar siempre visible */}
                <Avatar size="large" icon={<UserOutlined />} />
                {/* Mostrar solo el nombre si el sidebar está expandido */}
                {!collapsed && (
                  <span className="user-name" style={{ marginLeft: '10px' }}>
                    {usuario ? `${usuario.nombres} ${usuario.apellidoPaterno} ${usuario.apellidoMaterno || ''}` : 'Nombre no disponible'}
                  </span>
                )}
                <DownOutlined style={{ color: '#fff' }} />
              </Space>
            </Dropdown>
          </div>
        </Header>

        <Content style={{ padding: '0 24px' }}>
          <div style={{ margin: '24px 0' }}>
            {children}
          </div>
        </Content>

        <Footer
          style={{
            textAlign: 'center',
            backgroundColor: '#15afc6',
            color: '#fff',
            padding: '10px 0',
          }}
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              marginBottom: '10px',
              gap: '20px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaWhatsapp size={20} style={{ marginRight: '8px' }} />
              <span>
                Número WhatsApp: <strong>993 805 070</strong>
              </span>
            </div>

            <div style={{ display: 'flex', alignItems: 'center' }}>
              <FaEnvelope size={20} style={{ marginRight: '8px' }} />
              <span>
                Correo: <strong>contacto@vinali.pe</strong>
              </span>
            </div>
          </div>
        </Footer>
      </Layout>
    </Layout>
  );
};

export default MainLayout;