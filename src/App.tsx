import React, { useState, useEffect, useRef } from 'react';
import {
  MapPin,
  Map as MapIcon,
  Truck,
  Settings,
  LogOut,
  Plus,
  CheckSquare,
  Square,
  Navigation,
  Trash2,
  Lock,
  User as UserIcon,
  X,
  Info,
  List,
  MessageSquare,
  Users,
  Shield,
  Camera,
  Ban,
  Unlock,
  Edit2,
  Upload,
  Search,
  Palette,
  Image as ImageIcon,
} from 'lucide-react';

// --- CONFIGURACIÓN DE LEAFLET Y MAPAS ---
const useLeaflet = () => {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (window.L) {
      setLoaded(true);
      return;
    }
    const loadLeaflet = async () => {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css';
      document.head.appendChild(link);
      await new Promise((resolve) => setTimeout(resolve, 100));
      const script = document.createElement('script');
      script.src = 'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js';
      script.onload = () => setLoaded(true);
      document.head.appendChild(script);
    };
    loadLeaflet();
  }, []);

  return loaded;
};

// --- DATOS DE PRUEBA INICIALES ---
const INITIAL_STORES = [
  {
    id: 1,
    name: 'Ferretería Molina',
    zone: 'Norte',
    category: 'General',
    address: 'Av. Banzer 4to Anillo',
    lat: -17.75,
    lng: -63.1667,
    notes: 'Cierra a las 22:00',
    image:
      'https://images.unsplash.com/photo-1542880941-196142718cb4?auto=format&fit=crop&w=400&q=80',
    feedback: [],
  },
  {
    id: 2,
    name: 'Ferretería Camacho',
    zone: 'Sur',
    category: 'Construcción',
    address: 'Av. Santos Dumont 5to Anillo',
    lat: -17.8167,
    lng: -63.1833,
    notes: 'Descarga por portón trasero',
    image: '',
    feedback: [],
  },
  {
    id: 3,
    name: 'Ferretería Hilda',
    zone: 'Norte',
    category: 'Herramientas',
    address: 'Av. Cristo Redentor 7mo Anillo',
    lat: -17.7333,
    lng: -63.16,
    notes: 'Preguntar por Don Carlos',
    image:
      'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?auto=format&fit=crop&w=400&q=80',
    feedback: [],
  },
  {
    id: 4,
    name: 'Ferrecentro El Constructor',
    zone: 'Centro',
    category: 'Pinturas',
    address: 'Calle Florida esq. 21 de Mayo',
    lat: -17.7833,
    lng: -63.1833,
    notes: 'Difícil parqueo, ir temprano',
    image: '',
    feedback: [
      {
        text: 'Ya no venden pintura automotriz',
        driver: 'Juan Pérez',
        date: '29/05/2026',
      },
    ],
  },
];

const INITIAL_USERS = [
  {
    id: 1,
    username: 'admin',
    password: '123',
    role: 'admin',
    name: 'Administrador Principal',
    image: 'https://ui-avatars.com/api/?name=Admin&background=6b21a8&color=fff',
    status: 'active',
  },
  {
    id: 2,
    username: 'juan',
    password: '123',
    role: 'driver',
    name: 'Juan Pérez',
    image:
      'https://images.unsplash.com/photo-1633332755192-727a05c4013d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    status: 'active',
  },
  {
    id: 3,
    username: 'carlos',
    password: '123',
    role: 'driver',
    name: 'Carlos Roca',
    image: '',
    status: 'active',
  },
  {
    id: 4,
    username: 'mario',
    password: '123',
    role: 'driver',
    name: 'Mario López',
    image: '',
    status: 'blocked',
  },
];

const INITIAL_CONFIG = {
  name: 'FerreRutas Mejín',
  color: '#2563eb', // Azul por defecto
  logo: '', // Vacío usa el ícono de mapa
};

export default function App() {
  const isMapLoaded = useLeaflet();
  const [currentUser, setCurrentUser] = useState(null);

  const [stores, setStores] = useState(INITIAL_STORES);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [appConfig, setAppConfig] = useState(INITIAL_CONFIG); // Estado Global de Configuración

  if (!isMapLoaded) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <MapIcon className="w-12 h-12 text-blue-500 animate-bounce mb-4" />
        <p className="text-blue-600 font-bold text-lg">Cargando Mapas...</p>
      </div>
    );
  }

  // ESTILOS DINÁMICOS: Inyectamos el color elegido por el admin en variables CSS
  const themeStyles = `
    :root {
      --theme-color: ${appConfig.color};
      --theme-color-light: ${appConfig.color}20; /* 20% opacity */
    }
    .bg-theme { background-color: var(--theme-color) !important; color: white !important; }
    .text-theme { color: var(--theme-color) !important; }
    .border-theme { border-color: var(--theme-color) !important; }
    .hover-bg-theme:hover { background-color: var(--theme-color) !important; color: white !important; }
    .bg-theme-light { background-color: var(--theme-color-light) !important; }
    .fill-theme { fill: var(--theme-color) !important; }
  `;

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: themeStyles }} />
      <style
        dangerouslySetInnerHTML={{
          __html: `.animate-fade-in { animation: fadeIn 0.4s ease-in-out; } @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`,
        }}
      />

      {!currentUser ? (
        <LoginScreen
          users={users}
          onLogin={setCurrentUser}
          appConfig={appConfig}
        />
      ) : currentUser.role === 'admin' ? (
        <AdminDashboard
          stores={stores}
          setStores={setStores}
          users={users}
          setUsers={setUsers}
          appConfig={appConfig}
          setAppConfig={setAppConfig}
          onLogout={() => setCurrentUser(null)}
        />
      ) : (
        <DriverDashboard
          stores={stores}
          setStores={setStores}
          currentUser={currentUser}
          appConfig={appConfig}
          onLogout={() => setCurrentUser(null)}
        />
      )}
    </>
  );
}

// ==========================================
// 1. PANTALLA DE LOGIN
// ==========================================
function LoginScreen({ users, onLogin, appConfig }) {
  const [usernameInput, setUsernameInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    const userFound = users.find(
      (u) => u.username === usernameInput && u.password === passwordInput
    );

    if (userFound) {
      if (userFound.status === 'blocked') {
        setError('Tu cuenta ha sido bloqueada. Contacta al administrador.');
        return;
      }
      onLogin(userFound);
    } else {
      setError('Usuario o contraseña incorrectos.');
    }
  };

  return (
    <div
      className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-700 flex flex-col justify-center items-center p-4 relative overflow-hidden"
      style={{
        background: `linear-gradient(to bottom right, var(--theme-color), #1f2937)`,
      }}
    >
      <div className="bg-white p-8 rounded-3xl shadow-2xl w-full max-w-md animate-fade-in z-10 relative">
        <div className="flex justify-center mb-4">
          {appConfig.logo ? (
            <img
              src={appConfig.logo}
              alt="Logo"
              className="w-24 h-24 object-contain rounded-xl shadow-sm border border-gray-100 p-1"
            />
          ) : (
            <div className="bg-theme p-4 rounded-full shadow-lg border-4 border-gray-100">
              <MapIcon className="text-white w-12 h-12" />
            </div>
          )}
        </div>
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-1 leading-tight">
          {appConfig.name}
        </h1>
        <p className="text-center text-gray-500 mb-8 font-medium">
          Acceso al Sistema
        </p>

        {error && (
          <div className="bg-red-50 text-red-700 p-4 rounded-xl mb-6 text-sm text-center font-bold border border-red-200 shadow-sm flex flex-col items-center gap-2">
            {error.includes('bloqueada') ? (
              <Ban className="w-6 h-6 text-red-500" />
            ) : null}
            {error}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <div className="relative">
              <UserIcon className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={usernameInput}
                onChange={(e) => setUsernameInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition-all ring-theme"
                placeholder="Nombre de usuario"
              />
            </div>
          </div>
          <div>
            <div className="relative">
              <Lock className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
              <input
                type="password"
                value={passwordInput}
                onChange={(e) => setPasswordInput(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:ring-2 outline-none transition-all ring-theme"
                placeholder="Contraseña"
              />
            </div>
          </div>
          <button
            type="submit"
            className="w-full bg-theme text-white font-bold py-3.5 rounded-xl shadow-md active:transform active:scale-95 transition-all mt-6"
          >
            Ingresar
          </button>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 2. PANEL DE ADMINISTRADOR
// ==========================================
function AdminDashboard({
  stores,
  setStores,
  users,
  setUsers,
  appConfig,
  setAppConfig,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('ferreterias');
  const [editingStore, setEditingStore] = useState(null);
  const [editingUser, setEditingUser] = useState(null);

  // --- Manejo de Ferreterías ---
  const handleSaveStore = (store) => {
    if (store.id) {
      setStores(stores.map((s) => (s.id === store.id ? store : s)));
    } else {
      setStores([...stores, { ...store, id: Date.now(), feedback: [] }]);
    }
    setEditingStore(null);
  };

  // --- Manejo de Usuarios ---
  const handleSaveUser = (userData) => {
    if (userData.id) {
      setUsers(users.map((u) => (u.id === userData.id ? userData : u)));
    } else {
      if (users.some((u) => u.username === userData.username)) {
        alert('Ese nombre de usuario ya existe. Elige otro.');
        return;
      }
      setUsers([...users, { ...userData, id: Date.now() }]);
    }
    setEditingUser(null);
  };

  const toggleUserStatus = (id) => {
    setUsers(
      users.map((u) => {
        if (u.id === id)
          return { ...u, status: u.status === 'active' ? 'blocked' : 'active' };
        return u;
      })
    );
  };

  const handleDeleteUser = (id) => {
    if (
      window.confirm(
        '¿Seguro que deseas ELIMINAR permanentemente este usuario? Esta acción no se puede deshacer.'
      )
    ) {
      setUsers(users.filter((u) => u.id !== id));
    }
  };

  if (editingStore) {
    return (
      <StoreForm
        initialData={editingStore}
        onSave={handleSaveStore}
        onCancel={() => setEditingStore(null)}
        appConfig={appConfig}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <div className="bg-theme text-white p-4 flex justify-between items-center shadow-md shrink-0">
        <div className="flex items-center gap-3">
          {appConfig.logo ? (
            <img
              src={appConfig.logo}
              alt="Logo"
              className="w-8 h-8 rounded bg-white object-contain p-0.5"
            />
          ) : (
            <Settings className="w-6 h-6" />
          )}
          <h1 className="text-xl font-bold truncate max-w-[200px]">
            Admin: {appConfig.name}
          </h1>
        </div>
        <button
          onClick={onLogout}
          className="p-2 bg-black/20 rounded-full hover:bg-black/30 transition-colors"
        >
          <LogOut className="w-5 h-5" />
        </button>
      </div>

      {/* Tabs de Navegación Admin */}
      <div className="flex bg-white shadow-sm mb-4 border-b border-gray-200 overflow-x-auto hide-scrollbar">
        <button
          onClick={() => setActiveTab('ferreterias')}
          className={`flex-shrink-0 px-4 py-4 font-bold flex justify-center items-center gap-2 border-b-4 transition-colors ${
            activeTab === 'ferreterias'
              ? 'border-theme text-theme'
              : 'border-transparent text-gray-500 hover:bg-gray-50'
          }`}
        >
          <MapIcon className="w-5 h-5" /> Ferreterías
        </button>
        <button
          onClick={() => setActiveTab('usuarios')}
          className={`flex-shrink-0 px-4 py-4 font-bold flex justify-center items-center gap-2 border-b-4 transition-colors ${
            activeTab === 'usuarios'
              ? 'border-theme text-theme'
              : 'border-transparent text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Users className="w-5 h-5" /> Personal
        </button>
        <button
          onClick={() => setActiveTab('config')}
          className={`flex-shrink-0 px-4 py-4 font-bold flex justify-center items-center gap-2 border-b-4 transition-colors ${
            activeTab === 'config'
              ? 'border-theme text-theme'
              : 'border-transparent text-gray-500 hover:bg-gray-50'
          }`}
        >
          <Palette className="w-5 h-5" /> Configuración
        </button>
      </div>

      <div className="p-4 max-w-2xl mx-auto">
        {/* VISTA: FERRETERÍAS */}
        {activeTab === 'ferreterias' && (
          <div className="animate-fade-in">
            <button
              onClick={() =>
                setEditingStore({
                  name: '',
                  zone: '',
                  category: '',
                  address: '',
                  lat: -17.7833,
                  lng: -63.1833,
                  notes: '',
                  image: '',
                  feedback: [],
                })
              }
              className="w-full mb-6 bg-theme text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md transition-colors"
            >
              <Plus className="w-5 h-5" /> Añadir Nueva Ferretería en el Mapa
            </button>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase">
                Directorio ({stores.length})
              </h2>
              {stores.map((store) => (
                <div
                  key={store.id}
                  className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 flex flex-col gap-3"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex gap-4">
                      <div className="w-16 h-16 rounded-xl bg-gray-100 flex-shrink-0 overflow-hidden border border-gray-200 flex items-center justify-center">
                        {store.image ? (
                          <img
                            src={store.image}
                            alt={store.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <Camera className="w-6 h-6 text-gray-300" />
                        )}
                      </div>
                      <div>
                        <h3 className="font-bold text-gray-800 text-lg leading-tight">
                          {store.name}
                        </h3>
                        <p className="text-xs text-gray-500 flex items-center gap-1 mt-1">
                          <MapPin className="w-3 h-3" /> {store.address}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => setEditingStore(store)}
                      className="p-2 text-theme bg-theme-light rounded-lg font-semibold text-sm whitespace-nowrap ml-2 transition-colors border border-theme"
                    >
                      Editar
                    </button>
                  </div>

                  {store.feedback && store.feedback.length > 0 && (
                    <div className="bg-yellow-50 p-3 rounded-lg border border-yellow-200 mt-2">
                      <h4 className="text-xs font-bold text-yellow-800 mb-2 flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" /> Comentarios de
                        repartidores:
                      </h4>
                      <div className="space-y-2">
                        {store.feedback.map((f, i) => (
                          <div
                            key={i}
                            className="text-xs text-yellow-900 bg-white/60 p-2 rounded border border-yellow-100 flex justify-between"
                          >
                            <span>
                              <span className="font-bold">{f.driver}:</span>{' '}
                              {f.text}
                            </span>
                            <span className="text-[9px] text-yellow-600 opacity-70">
                              {f.date}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: USUARIOS */}
        {activeTab === 'usuarios' && (
          <div className="animate-fade-in">
            <button
              onClick={() =>
                setEditingUser({
                  name: '',
                  username: '',
                  password: '',
                  role: 'driver',
                  image: '',
                  status: 'active',
                })
              }
              className="w-full mb-6 bg-green-600 text-white font-bold py-3 rounded-xl flex items-center justify-center gap-2 shadow-md hover:bg-green-700 transition-colors"
            >
              <Plus className="w-5 h-5" /> Registrar Nuevo Usuario
            </button>

            <div className="space-y-4">
              <h2 className="text-sm font-bold text-gray-500 uppercase">
                Personal Registrado ({users.length})
              </h2>
              {users.map((user) => (
                <div
                  key={user.id}
                  className={`bg-white p-4 rounded-xl shadow-sm border ${
                    user.status === 'blocked'
                      ? 'border-red-200 bg-red-50/30'
                      : 'border-gray-200'
                  } flex flex-col gap-3`}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full overflow-hidden border-2 flex items-center justify-center flex-shrink-0 ${
                          user.status === 'blocked'
                            ? 'border-red-300 opacity-50'
                            : user.role === 'admin'
                            ? 'border-purple-200 bg-purple-50'
                            : 'border-blue-200 bg-blue-50'
                        }`}
                      >
                        {user.image ? (
                          <img
                            src={user.image}
                            alt={user.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <UserIcon
                            className={`w-6 h-6 ${
                              user.role === 'admin'
                                ? 'text-purple-400'
                                : 'text-blue-400'
                            }`}
                          />
                        )}
                      </div>

                      <div>
                        <h3
                          className={`font-bold text-md flex items-center gap-2 ${
                            user.status === 'blocked'
                              ? 'text-red-700 line-through'
                              : 'text-gray-800'
                          }`}
                        >
                          {user.name}
                          {user.status === 'blocked' && (
                            <Ban className="w-3 h-3 text-red-500" />
                          )}
                        </h3>
                        <div className="flex gap-2 items-center mt-1">
                          <span className="text-xs text-gray-500 font-mono bg-gray-100 px-2 py-0.5 rounded border border-gray-200">
                            @{user.username}
                          </span>
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded uppercase ${
                              user.role === 'admin'
                                ? 'bg-purple-100 text-purple-700'
                                : 'bg-blue-100 text-blue-700'
                            }`}
                          >
                            {user.role === 'admin' ? 'Admin' : 'Repartidor'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 items-end">
                      <button
                        onClick={() => setEditingUser(user)}
                        className="text-theme bg-theme-light px-3 py-1.5 rounded-lg font-bold text-xs hover:opacity-80 border border-theme flex items-center gap-1"
                      >
                        <Edit2 className="w-3 h-3" /> Editar
                      </button>
                    </div>
                  </div>

                  {user.username !== 'admin' && (
                    <div className="flex gap-2 mt-2 pt-3 border-t border-gray-100">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className={`flex-1 py-2 rounded-xl text-xs font-bold transition-colors border flex justify-center items-center gap-1 ${
                          user.status === 'active'
                            ? 'text-orange-600 bg-orange-50 border-orange-100 hover:bg-orange-100'
                            : 'text-green-600 bg-green-50 border-green-100 hover:bg-green-100'
                        }`}
                      >
                        {user.status === 'active' ? (
                          <>
                            <Ban className="w-4 h-4" /> Bloquear Acceso
                          </>
                        ) : (
                          <>
                            <Unlock className="w-4 h-4" /> Desbloquear
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteUser(user.id)}
                        className="flex-1 py-2 text-red-600 bg-red-50 border border-red-100 rounded-xl hover:bg-red-100 transition-colors text-xs font-bold flex justify-center items-center gap-1"
                      >
                        <Trash2 className="w-4 h-4" /> Eliminar
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* VISTA: CONFIGURACIÓN / MARCA BLANCA */}
        {activeTab === 'config' && (
          <div className="animate-fade-in">
            <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-200">
              <h2 className="text-xl font-extrabold text-gray-800 mb-6 flex items-center gap-2">
                <Palette className="text-theme" /> Personalizar Aplicación
              </h2>

              <div className="space-y-6">
                {/* Logo */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">
                    Logo de la Empresa
                  </label>
                  <div className="flex gap-4 items-center bg-gray-50 p-4 rounded-xl border border-gray-100">
                    <div className="w-20 h-20 rounded-xl bg-white border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 shadow-sm relative">
                      {appConfig.logo ? (
                        <img
                          src={appConfig.logo}
                          alt="Logo"
                          className="w-full h-full object-contain p-2"
                        />
                      ) : (
                        <ImageIcon className="w-8 h-8 text-gray-300" />
                      )}
                    </div>
                    <div className="flex-1 relative">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files[0];
                          if (file) {
                            const reader = new FileReader();
                            reader.onloadend = () =>
                              setAppConfig({
                                ...appConfig,
                                logo: reader.result,
                              });
                            reader.readAsDataURL(file);
                          }
                        }}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                      />
                      <button className="bg-theme text-white text-sm font-bold py-2 px-4 rounded-lg w-full flex items-center justify-center gap-2 shadow-sm pointer-events-none">
                        <Upload className="w-4 h-4" /> Subir Logo
                      </button>
                      <p className="text-[10px] text-gray-500 mt-2">
                        Recomendado: Imagen PNG cuadrada.
                      </p>

                      {appConfig.logo && (
                        <button
                          onClick={() =>
                            setAppConfig({ ...appConfig, logo: '' })
                          }
                          className="text-[10px] font-bold text-red-500 mt-2 hover:underline z-20 relative"
                        >
                          Quitar logo actual
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                {/* Nombre */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                    Nombre Oficial del Sistema
                  </label>
                  <input
                    type="text"
                    value={appConfig.name}
                    onChange={(e) =>
                      setAppConfig({ ...appConfig, name: e.target.value })
                    }
                    className="w-full border-2 border-gray-200 rounded-xl py-3 px-4 focus:ring-2 outline-none font-bold text-gray-800 transition-all ring-theme"
                  />
                </div>

                {/* Color */}
                <div>
                  <label className="text-xs font-bold text-gray-600 uppercase mb-1 block">
                    Color Principal de la Marca
                  </label>
                  <div className="flex items-center gap-4 bg-gray-50 p-3 rounded-xl border border-gray-200">
                    <input
                      type="color"
                      value={appConfig.color}
                      onChange={(e) =>
                        setAppConfig({ ...appConfig, color: e.target.value })
                      }
                      className="w-12 h-12 rounded cursor-pointer border-0 p-0"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-bold text-gray-800">
                        Elige un color corporativo
                      </p>
                      <p className="text-xs text-gray-500">
                        Este color se aplicará a botones, menús y pines del
                        mapa.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 bg-theme-light p-4 rounded-xl border border-theme flex items-center gap-3">
              <Info className="w-6 h-6 text-theme flex-shrink-0" />
              <p className="text-xs font-bold text-gray-700">
                Los cambios visuales se guardan automáticamente y son visibles
                para todos los repartidores al instante.
              </p>
            </div>
          </div>
        )}
      </div>

      {editingUser && (
        <UserFormModal
          initialData={editingUser}
          onSave={handleSaveUser}
          onCancel={() => setEditingUser(null)}
        />
      )}

      <style
        dangerouslySetInnerHTML={{
          __html: `.hide-scrollbar::-webkit-scrollbar { display: none; } .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }`,
        }}
      />
    </div>
  );
}

// COMPONENTE PARA EL MODAL DE USUARIO (Maneja subida de archivos)
function UserFormModal({ initialData, onSave, onCancel }) {
  const [formData, setFormData] = useState(initialData);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[600] flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative max-h-[90vh] overflow-y-auto">
        <button
          type="button"
          onClick={onCancel}
          className="absolute top-4 right-4 text-gray-400 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>

        <h3 className="font-extrabold text-xl text-gray-800 mb-4 flex items-center gap-2">
          {formData.id ? (
            <>
              <Edit2 className="text-theme" /> Editar Usuario
            </>
          ) : (
            <>
              <Users className="text-green-600" /> Nuevo Usuario
            </>
          )}
        </h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col items-center justify-center mb-4">
            <div className="w-24 h-24 bg-gray-100 rounded-full border-4 border-dashed border-gray-300 flex items-center justify-center overflow-hidden relative group">
              {formData.image ? (
                <img
                  src={formData.image}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              ) : (
                <Camera className="w-8 h-8 text-gray-300" />
              )}
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Upload className="w-6 h-6 text-white" />
              </div>
            </div>
            <p className="text-[10px] text-gray-500 mt-2 font-bold uppercase">
              Toca para subir foto
            </p>
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">
              Nombre Completo
            </label>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border-b-2 border-gray-200 py-2 focus:border-green-600 outline-none transition-colors ring-theme"
              placeholder="Ej: Pedro Gómez"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">
              Usuario (Login)
            </label>
            <input
              required
              type="text"
              value={formData.username}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  username: e.target.value.toLowerCase().replace(/\s/g, ''),
                })
              }
              className="w-full border-b-2 border-gray-200 py-2 focus:border-green-600 outline-none font-mono transition-colors ring-theme"
              placeholder="Ej: pedro"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-gray-600 uppercase">
              Contraseña
            </label>
            <input
              required
              type="text"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              className="w-full border-b-2 border-gray-200 py-2 focus:border-green-600 outline-none transition-colors ring-theme"
              placeholder="Establece una contraseña"
            />
          </div>

          {formData.username !== 'admin' && (
            <div>
              <label className="text-xs font-bold text-gray-600 uppercase mb-2 block">
                Rol / Permisos
              </label>
              <div className="flex gap-2">
                <label
                  className={`flex-1 border p-3 rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    formData.role === 'driver'
                      ? 'border-theme bg-theme-light'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="driver"
                    checked={formData.role === 'driver'}
                    onChange={() =>
                      setFormData({ ...formData, role: 'driver' })
                    }
                    className="hidden"
                  />
                  <Truck
                    className={`w-6 h-6 ${
                      formData.role === 'driver'
                        ? 'text-theme'
                        : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      formData.role === 'driver'
                        ? 'text-theme'
                        : 'text-gray-500'
                    }`}
                  >
                    Repartidor
                  </span>
                </label>
                <label
                  className={`flex-1 border p-3 rounded-xl flex flex-col items-center gap-1 cursor-pointer transition-all ${
                    formData.role === 'admin'
                      ? 'border-purple-500 bg-purple-50'
                      : 'border-gray-200'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value="admin"
                    checked={formData.role === 'admin'}
                    onChange={() => setFormData({ ...formData, role: 'admin' })}
                    className="hidden"
                  />
                  <Shield
                    className={`w-6 h-6 ${
                      formData.role === 'admin'
                        ? 'text-purple-600'
                        : 'text-gray-400'
                    }`}
                  />
                  <span
                    className={`text-xs font-bold ${
                      formData.role === 'admin'
                        ? 'text-purple-700'
                        : 'text-gray-500'
                    }`}
                  >
                    Admin
                  </span>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            className={`w-full text-white font-bold py-3.5 rounded-xl shadow-md mt-6 transition-transform active:scale-95 ${
              formData.id
                ? 'bg-theme hover:opacity-90'
                : 'bg-green-600 hover:bg-green-700'
            }`}
          >
            {formData.id ? 'Guardar Cambios' : 'Crear Cuenta'}
          </button>
        </form>
      </div>
    </div>
  );
}

// FORMULARIO CON MAPA: Editar/Crear Ferretería
function StoreForm({ initialData, onSave, onCancel, appConfig }) {
  const [formData, setFormData] = useState(initialData);
  const mapRef = useRef(null);

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () =>
        setFormData({ ...formData, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  useEffect(() => {
    if (!window.L) return;
    const mapContainer = document.getElementById('admin-map');
    if (!mapContainer) return;
    if (mapRef.current) mapRef.current.remove();

    const map = window.L.map('admin-map').setView(
      [formData.lat, formData.lng],
      13
    );
    window.L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap',
    }).addTo(map);

    const customIcon = window.L.divIcon({
      className: 'custom-pin-admin',
      html: `
        <div style="position: relative; display: flex; flex-direction: column; items-center;">
          <div style="background-color: #ef4444; width: 32px; height: 32px; border-radius: 50% 50% 50% 0; border: 3px solid white; box-shadow: 0 0 6px rgba(0,0,0,0.5); transform: rotate(-45deg); display: flex; align-items: center; justify-content: center;">
            <div style="transform: rotate(45deg); color: white;">📍</div>
          </div>
        </div>
      `,
      iconSize: [32, 32],
      iconAnchor: [16, 32],
    });

    const marker = window.L.marker([formData.lat, formData.lng], {
      icon: customIcon,
      draggable: true,
    }).addTo(map);
    marker.on('dragend', () => {
      const pos = marker.getLatLng();
      setFormData((prev) => ({ ...prev, lat: pos.lat, lng: pos.lng }));
    });
    map.on('click', (e) => {
      marker.setLatLng(e.latlng);
      setFormData((prev) => ({
        ...prev,
        lat: e.latlng.lat,
        lng: e.latlng.lng,
      }));
    });

    mapRef.current = map;
    setTimeout(() => {
      map.invalidateSize();
    }, 200);
    return () => map.remove();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col animate-fade-in">
      <div className="bg-white p-4 flex items-center justify-between shadow-sm z-10 relative">
        <h2 className="font-bold text-lg text-gray-800">
          {formData.id ? 'Editar Ferretería' : 'Nueva Ferretería'}
        </h2>
        <button
          type="button"
          onClick={onCancel}
          className="p-2 text-gray-500 bg-gray-100 rounded-full hover:bg-gray-200"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <div className="flex-1 flex flex-col overflow-y-auto pb-6">
        <div className="relative h-48 w-full bg-gray-200 shadow-inner z-0 flex-shrink-0">
          <div id="admin-map" className="w-full h-full z-0"></div>
          <div className="absolute top-2 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-4 py-1.5 rounded-full shadow-md text-[10px] font-bold text-gray-700 z-[400] pointer-events-none border border-gray-200">
            Mueve el pin rojo para ajustar ubicación
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            onSave(formData);
          }}
          className="bg-white p-5 shadow-[0_-10px_20px_rgba(0,0,0,0.05)] z-10 rounded-t-3xl -mt-4 relative"
        >
          <div className="space-y-4 max-w-lg mx-auto">
            <div className="flex gap-4 items-center bg-gray-50 p-3 rounded-xl border border-gray-100 relative group overflow-hidden">
              <div className="w-16 h-16 rounded-xl bg-gray-200 border-2 border-dashed border-gray-300 flex items-center justify-center overflow-hidden flex-shrink-0 relative">
                {formData.image ? (
                  <img
                    src={formData.image}
                    alt="Fachada"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Camera className="w-6 h-6 text-gray-400" />
                )}
              </div>
              <div className="flex-1">
                <label className="text-[10px] font-bold text-theme uppercase mb-1 block">
                  Subir foto desde dispositivo
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="w-full text-xs file:mr-4 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-bold file:bg-theme file:text-white hover:file:opacity-90 cursor-pointer"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs bg-gray-50 p-2 rounded-lg border border-gray-100">
              <div>
                <span className="font-bold text-gray-500">Lat:</span>{' '}
                {formData.lat.toFixed(5)}
              </div>
              <div>
                <span className="font-bold text-gray-500">Lng:</span>{' '}
                {formData.lng.toFixed(5)}
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Nombre de Ferretería
              </label>
              <input
                required
                type="text"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                className="w-full border-b-2 border-gray-200 py-2 focus:border-theme outline-none font-medium text-lg transition-colors ring-theme"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Dirección (Referencia)
              </label>
              <input
                required
                type="text"
                value={formData.address}
                onChange={(e) =>
                  setFormData({ ...formData, address: e.target.value })
                }
                className="w-full border-b-2 border-gray-200 py-2 focus:border-theme outline-none transition-colors ring-theme"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Zona
                </label>
                <input
                  required
                  type="text"
                  value={formData.zone}
                  onChange={(e) =>
                    setFormData({ ...formData, zone: e.target.value })
                  }
                  className="w-full border-b-2 border-gray-200 py-2 focus:border-theme outline-none transition-colors ring-theme"
                  placeholder="Ej: Norte"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-gray-600 uppercase">
                  Categoría
                </label>
                <input
                  required
                  type="text"
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full border-b-2 border-gray-200 py-2 focus:border-theme outline-none transition-colors ring-theme"
                  placeholder="Ej: Pinturas"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-gray-600 uppercase">
                Notas Especiales
              </label>
              <input
                type="text"
                value={formData.notes}
                onChange={(e) =>
                  setFormData({ ...formData, notes: e.target.value })
                }
                className="w-full border-b-2 border-gray-200 py-2 focus:border-theme outline-none text-sm transition-colors ring-theme"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-theme text-white font-bold py-3.5 rounded-xl shadow-md mt-4 transition-transform active:scale-95 hover-bg-theme"
            >
              Guardar Datos y Ubicación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ==========================================
// 3. PANEL DEL REPARTIDOR (CON BUSCADOR INTEGRAD0)
// ==========================================
function DriverDashboard({
  stores,
  setStores,
  currentUser,
  appConfig,
  onLogout,
}) {
  const [activeTab, setActiveTab] = useState('mapa');
  const [myRouteIds, setMyRouteIds] = useState([]);
  const [selectedStore, setSelectedStore] = useState(null);
  const [searchQuery, setSearchQuery] = useState(''); // Estado para el buscador

  const [feedbackModalOpen, setFeedbackModalOpen] = useState(false);
  const [storeForFeedback, setStoreForFeedback] = useState(null);
  const [feedbackText, setFeedbackText] = useState('');

  const mapRef = useRef(null);
  const markersRef = useRef({});
  const polylineRef = useRef(null);

  // Filtrado de tiendas basado en la búsqueda
  const filteredStores = stores.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.zone.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const routeStores = myRouteIds
    .map((id) => stores.find((s) => s.id === id))
    .filter(Boolean);

  const wrenchIconSVG = `
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
      <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>
    </svg>
  `;

  useEffect(() => {
    if (!window.L || activeTab !== 'mapa') return;

    if (!mapRef.current) {
      const mapContainer = document.getElementById('driver-map');
      if (!mapContainer) return;

      const map = window.L.map('driver-map', { zoomControl: false }).setView(
        [-17.7833, -63.1833],
        13
      );
      window.L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution: '© OpenStreetMap',
        }
      ).addTo(map);
      mapRef.current = map;
      setTimeout(() => {
        map.invalidateSize();
      }, 100);
    }

    const map = mapRef.current;

    Object.values(markersRef.current).forEach((marker) => marker.remove());
    markersRef.current = {};

    // USAMOS FILTERED_STORES EN LUGAR DE STORES PARA EL MAPA
    filteredStores.forEach((store) => {
      const isSelectedForRoute = myRouteIds.includes(store.id);
      const isCurrentlySelected =
        selectedStore && selectedStore.id === store.id;

      // El color normal del pin ahora usa el color configurado por el admin (appConfig.color)
      const pinColor = isSelectedForRoute
        ? '#10b981'
        : isCurrentlySelected
        ? '#f59e0b'
        : appConfig.color;
      const orderNumber = isSelectedForRoute
        ? myRouteIds.indexOf(store.id) + 1
        : '';

      const iconHtml = `
        <div class="custom-store-pin" style="display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); width: 200px;">
          <div style="
            background-color: ${pinColor}; 
            width: 44px; height: 44px; border-radius: 50% 50% 50% 0; border: 3px solid white; box-shadow: 0 4px 8px rgba(0,0,0,0.3); transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; z-index: 10; transition: all 0.2s ease;
            ${
              isCurrentlySelected
                ? 'transform: rotate(-45deg) scale(1.1); box-shadow: 0 6px 12px rgba(245, 158, 11, 0.4);'
                : ''
            }
          ">
            <div style="transform: rotate(45deg); color: white; display: flex; align-items: center; justify-content: center; width: 100%; height: 100%;">
              ${
                isSelectedForRoute
                  ? `<span style="font-weight: 900; font-size: 18px;">${orderNumber}</span>`
                  : wrenchIconSVG
              }
            </div>
          </div>
          <div style="
            background-color: white; color: #1e293b; padding: 4px 10px; border-radius: 8px; font-size: 13px; font-weight: 800; margin-top: 6px; box-shadow: 0 2px 6px rgba(0,0,0,0.15); border: 1px solid #e2e8f0; white-space: nowrap; text-align: center; max-width: 180px; overflow: hidden; text-overflow: ellipsis; z-index: 5;
            ${
              isSelectedForRoute ? 'border-color: #10b981; color: #047857;' : ''
            }
          ">
            ${store.name}
          </div>
        </div>
      `;

      const customIcon = window.L.divIcon({
        className: 'transparent-leaflet-icon',
        html: iconHtml,
        iconSize: [0, 0],
        iconAnchor: [0, 0],
      });

      const marker = window.L.marker([store.lat, store.lng], {
        icon: customIcon,
      }).addTo(map);

      marker.on('click', () => {
        setSelectedStore(store);
        const latOffset = 0.005;
        map.flyTo([store.lat - latOffset, store.lng], 14, {
          animate: true,
          duration: 0.5,
        });
      });

      markersRef.current[store.id] = marker;
    });

    if (polylineRef.current) {
      polylineRef.current.remove();
    }

    if (myRouteIds.length > 1) {
      const latlngs = routeStores.map((store) => [store.lat, store.lng]);
      polylineRef.current = window.L.polyline(latlngs, {
        color: '#10b981',
        weight: 5,
        opacity: 0.8,
        dashArray: '10, 10',
        lineJoin: 'round',
      }).addTo(map);
    }
  }, [filteredStores, myRouteIds, activeTab, selectedStore, appConfig.color]);

  const toggleRoute = (store) => {
    if (myRouteIds.includes(store.id)) {
      setMyRouteIds(myRouteIds.filter((id) => id !== store.id));
    } else {
      setMyRouteIds([...myRouteIds, store.id]);
    }
  };

  const getGoogleMapsDeepLink = (store) =>
    `https://www.google.com/maps/dir/?api=1&destination=${store.lat},${store.lng}`;

  const openFeedback = (store) => {
    setStoreForFeedback(store);
    setFeedbackText('');
    setFeedbackModalOpen(true);
  };

  const submitFeedback = () => {
    if (!feedbackText.trim()) return;
    const updatedStores = stores.map((s) => {
      if (s.id === storeForFeedback.id) {
        const newFeedback = {
          text: feedbackText,
          driver: currentUser.name,
          date: new Date().toLocaleDateString(),
        };
        return { ...s, feedback: [...(s.feedback || []), newFeedback] };
      }
      return s;
    });
    setStores(updatedStores);
    setFeedbackModalOpen(false);
    setStoreForFeedback(null);
  };

  const getAvatarUrl = (name) =>
    `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=f3f4f6&color=111827`;
  const getStoreImage = (url) =>
    url ||
    'https://images.unsplash.com/photo-1542880941-196142718cb4?auto=format&fit=crop&w=400&q=80&blur=2';

  // Componente de barra de búsqueda reutilizable
  const SearchBar = () => (
    <div className="relative w-full shadow-lg rounded-2xl pointer-events-auto">
      <Search className="absolute left-4 top-3.5 text-gray-400 w-5 h-5" />
      <input
        type="text"
        placeholder="Buscar ferretería o zona..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full pl-12 pr-10 py-3.5 bg-white border-none rounded-2xl outline-none font-medium text-gray-800 placeholder-gray-400 focus:ring-4 ring-theme/30 transition-all"
      />
      {searchQuery && (
        <button
          onClick={() => setSearchQuery('')}
          className="absolute right-3 top-3 p-1 rounded-full bg-gray-100 text-gray-500 hover:bg-gray-200"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );

  return (
    <div className="h-screen bg-gray-50 flex flex-col relative overflow-hidden">
      {/* HEADER FLOTANTE (Solo Mapa) */}
      {activeTab === 'mapa' && (
        <div className="absolute top-0 left-0 right-0 z-[500] pointer-events-none flex flex-col items-stretch pt-4 px-4 pb-0 gap-3">
          <div className="flex justify-between items-start">
            <div className="bg-white/95 backdrop-blur shadow-lg p-2 rounded-full pointer-events-auto border border-white/50 flex items-center gap-3 pr-5">
              <img
                src={currentUser.image || getAvatarUrl(currentUser.name)}
                alt="Perfil"
                className="w-10 h-10 rounded-full border border-gray-200 object-cover"
              />
              <div>
                <h1 className="text-sm font-extrabold text-gray-800 leading-none truncate max-w-[150px]">
                  {appConfig.name}
                </h1>
                <p className="text-[10px] font-bold text-theme">
                  {currentUser.name}
                </p>
              </div>
            </div>
            <button
              onClick={onLogout}
              className="bg-white/95 backdrop-blur shadow-lg p-3 rounded-full pointer-events-auto text-red-600 border border-white/50 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
            </button>
          </div>

          {/* BARRA DE BÚSQUEDA FLOTANTE EN EL MAPA */}
          <div className="w-full mt-1">
            <SearchBar />
          </div>
        </div>
      )}

      {/* HEADER NORMAL (Lista y Ruta) */}
      {activeTab !== 'mapa' && (
        <div className="bg-theme text-white p-4 flex justify-between items-center shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <img
              src={currentUser.image || getAvatarUrl(currentUser.name)}
              alt="Perfil"
              className="w-10 h-10 rounded-full border-2 border-white/50 object-cover bg-white"
            />
            <div>
              <h1 className="text-xl font-extrabold leading-none truncate max-w-[200px]">
                {appConfig.name}
              </h1>
              <p className="text-xs mt-1 uppercase font-semibold opacity-80">
                {activeTab === 'lista' ? 'Directorio' : 'Mi Ruta de Hoy'}
              </p>
            </div>
          </div>
          <button
            onClick={onLogout}
            className="p-2 bg-black/20 rounded-full hover:bg-black/30 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ÁREA 1: MAPA */}
      <div
        className={`flex-1 relative ${
          activeTab === 'mapa' ? 'block' : 'hidden'
        }`}
      >
        <div id="driver-map" className="w-full h-full z-0"></div>

        {myRouteIds.length > 0 && (
          <div className="absolute top-[135px] left-4 z-[400] bg-white/95 backdrop-blur px-4 py-2 rounded-xl shadow-md border border-green-100 flex items-center gap-2 pointer-events-auto">
            <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
            <span className="text-sm font-extrabold text-gray-700">
              {myRouteIds.length} paradas
            </span>
          </div>
        )}

        {/* BOTTOM SHEET: DETALLE EN EL MAPA */}
        {selectedStore && (
          <div className="absolute bottom-4 left-0 right-0 z-[500] p-4 animate-slide-up pointer-events-none">
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-100 pointer-events-auto relative">
              <div className="h-24 w-full bg-gray-200 relative">
                <img
                  src={getStoreImage(selectedStore.image)}
                  alt="Fachada"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                <button
                  onClick={() => setSelectedStore(null)}
                  className="absolute top-3 right-3 text-white bg-black/30 backdrop-blur rounded-full p-1.5 hover:bg-black/50"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="p-5 -mt-6 relative z-10 bg-white rounded-t-3xl">
                <h2 className="text-2xl font-extrabold text-gray-800 leading-tight">
                  {selectedStore.name}
                </h2>
                <p className="text-sm text-gray-500 mt-1 font-medium">
                  {selectedStore.address}
                </p>

                <div className="flex gap-2 mt-3 mb-4">
                  <span className="bg-theme-light text-theme px-3 py-1 text-[11px] font-extrabold rounded-lg border border-theme uppercase">
                    {selectedStore.category}
                  </span>
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 text-[11px] font-extrabold rounded-lg uppercase">
                    Zona {selectedStore.zone}
                  </span>
                </div>

                {selectedStore.notes && (
                  <p className="text-sm bg-yellow-50 text-yellow-800 p-3 rounded-xl border border-yellow-200 mb-4 flex gap-2 items-start font-medium">
                    <Info className="w-5 h-5 flex-shrink-0 mt-0.5" />
                    <span>{selectedStore.notes}</span>
                  </p>
                )}

                <div className="flex gap-3 mt-2">
                  <button
                    onClick={() => toggleRoute(selectedStore)}
                    className={`flex-1 py-3 rounded-xl font-bold text-sm flex items-center justify-center gap-2 transition-all border-2 ${
                      myRouteIds.includes(selectedStore.id)
                        ? 'bg-red-50 border-red-200 text-red-600'
                        : 'bg-green-500 border-green-500 text-white shadow-lg shadow-green-500/30'
                    }`}
                  >
                    {myRouteIds.includes(selectedStore.id) ? (
                      <>
                        <Trash2 className="w-5 h-5" /> Quitar
                      </>
                    ) : (
                      <>
                        <CheckSquare className="w-5 h-5" /> Añadir ruta
                      </>
                    )}
                  </button>

                  <a
                    href={getGoogleMapsDeepLink(selectedStore)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-theme text-white px-4 py-3 rounded-xl flex items-center justify-center shadow-lg hover-bg-theme"
                  >
                    <Navigation className="w-5 h-5" />
                  </a>

                  <button
                    onClick={() => openFeedback(selectedStore)}
                    className="bg-gray-100 text-gray-700 px-4 py-3 rounded-xl flex items-center justify-center shadow hover:bg-gray-200 border border-gray-200"
                  >
                    <MessageSquare className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ÁREA 2: DIRECTORIO */}
      {activeTab === 'lista' && (
        <div className="flex-1 flex flex-col bg-gray-50 overflow-hidden">
          {/* Buscador fijo superior en lista */}
          <div className="bg-white p-4 shadow-sm z-10 shrink-0">
            <SearchBar />
          </div>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 animate-fade-in pb-20">
            {filteredStores.length === 0 ? (
              <div className="text-center py-12 mt-10">
                <Search className="w-16 h-16 text-gray-200 mx-auto mb-4" />
                <p className="text-gray-600 font-bold text-lg">
                  No hay resultados
                </p>
                <p className="text-sm text-gray-400 mt-2">
                  Intenta buscar con otras palabras.
                </p>
              </div>
            ) : (
              filteredStores.map((store) => {
                const isSelected = myRouteIds.includes(store.id);
                return (
                  <div
                    key={store.id}
                    className={`bg-white p-3 rounded-2xl shadow-sm border-2 transition-all flex gap-3 ${
                      isSelected
                        ? 'border-green-500 bg-green-50/30'
                        : 'border-transparent'
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <button
                        onClick={() => toggleRoute(store)}
                        className="flex-shrink-0"
                      >
                        {isSelected ? (
                          <CheckSquare className="w-8 h-8 text-green-500" />
                        ) : (
                          <Square className="w-8 h-8 text-gray-300" />
                        )}
                      </button>
                    </div>

                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-1">
                        <h3 className="font-extrabold text-gray-800 text-lg leading-tight">
                          {store.name}
                        </h3>
                      </div>

                      <div className="flex gap-2">
                        <div className="w-16 h-16 rounded-lg bg-gray-100 overflow-hidden flex-shrink-0 mt-1 border border-gray-200">
                          <img
                            src={getStoreImage(store.image)}
                            alt="Foto"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div>
                          <p className="text-xs text-gray-500 font-medium">
                            {store.address}
                          </p>
                          <span className="inline-block mt-1 text-[9px] uppercase font-bold bg-theme-light text-theme px-2 py-0.5 rounded border border-theme">
                            Zona {store.zone}
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-between items-center mt-3 pt-2 border-t border-gray-100/50">
                        <button
                          onClick={() => openFeedback(store)}
                          className="text-theme text-[11px] font-bold flex items-center gap-1 hover:bg-gray-100 px-2 py-1 rounded"
                        >
                          <MessageSquare className="w-3 h-3" /> Reportar
                        </button>
                        {store.feedback && store.feedback.length > 0 && (
                          <span className="text-[10px] bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full font-bold">
                            {store.feedback.length} notas
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* ÁREA 3: RUTA */}
      {activeTab === 'ruta' && (
        <div className="flex-1 overflow-y-auto bg-gray-50 p-4 space-y-4 animate-fade-in pb-20">
          {routeStores.length === 0 ? (
            <div className="text-center py-12 mt-10">
              <Truck className="w-20 h-20 text-gray-200 mx-auto mb-4" />
              <p className="text-gray-600 font-bold text-lg">
                Tu ruta está vacía
              </p>
              <p className="text-sm text-gray-400 mt-2">
                Ve al Directorio o al Mapa para armar tu recorrido de hoy.
              </p>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute left-5 top-5 bottom-5 w-1 bg-green-200 z-0 rounded-full"></div>
              {routeStores.map((store, index) => (
                <div
                  key={store.id}
                  className="relative z-10 flex gap-4 mb-6 bg-white p-4 rounded-2xl shadow-sm border border-gray-100"
                >
                  <div className="w-10 h-10 flex-shrink-0 bg-green-500 text-white rounded-full flex items-center justify-center font-black text-lg shadow-md border-4 border-white -ml-1">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h3 className="font-extrabold text-gray-800 text-lg">
                      {store.name}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3 font-medium">
                      {store.address}
                    </p>

                    <div className="flex gap-2">
                      <a
                        href={getGoogleMapsDeepLink(store)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex-1 bg-theme hover-bg-theme text-white text-xs font-bold py-2.5 rounded-xl flex items-center justify-center gap-2 shadow"
                      >
                        <Navigation className="w-4 h-4" /> GPS
                      </a>
                      <button
                        onClick={() => toggleRoute(store)}
                        className="px-3 bg-red-50 text-red-500 rounded-xl border border-red-100 hover:bg-red-100"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* MODAL DE FEEDBACK */}
      {feedbackModalOpen && storeForFeedback && (
        <div className="fixed inset-0 bg-black/60 z-[600] flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl p-6 w-full max-w-sm shadow-2xl relative">
            <button
              onClick={() => setFeedbackModalOpen(false)}
              className="absolute top-4 right-4 text-gray-400 bg-gray-100 rounded-full p-2 hover:bg-gray-200"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="font-extrabold text-xl text-gray-800 mb-1">
              Reportar Novedad
            </h3>
            <p className="text-sm text-theme font-bold mb-4">
              {storeForFeedback.name}
            </p>

            <textarea
              className="w-full bg-gray-50 border border-gray-200 rounded-xl p-3 text-sm focus:ring-2 outline-none min-h-[100px] mb-4 resize-none ring-theme"
              placeholder="Ej: La ferretería cambió de nombre o no abren los sábados..."
              value={feedbackText}
              onChange={(e) => setFeedbackText(e.target.value)}
            ></textarea>

            <button
              onClick={submitFeedback}
              disabled={!feedbackText.trim()}
              className="w-full bg-theme disabled:bg-gray-300 text-white font-bold py-3.5 rounded-xl shadow-md transition-transform active:scale-95 flex items-center justify-center gap-2 hover-bg-theme"
            >
              <MessageSquare className="w-5 h-5" /> Enviar Reporte
            </button>
          </div>
        </div>
      )}

      {/* NAVEGACIÓN INFERIOR */}
      <div className="bg-white border-t border-gray-200 pb-safe shadow-[0_-5px_15px_-10px_rgba(0,0,0,0.1)] z-[500] relative shrink-0">
        <div className="flex max-w-md mx-auto">
          <button
            onClick={() => setActiveTab('mapa')}
            className={`flex-1 flex flex-col items-center py-3.5 px-2 transition-colors ${
              activeTab === 'mapa'
                ? 'text-theme'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <MapPin className="w-6 h-6 mb-1" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              Mapa
            </span>
          </button>

          <button
            onClick={() => setActiveTab('lista')}
            className={`flex-1 flex flex-col items-center py-3.5 px-2 transition-colors ${
              activeTab === 'lista'
                ? 'text-theme'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <List className="w-6 h-6 mb-1" />
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              Directorio
            </span>
          </button>

          <button
            onClick={() => setActiveTab('ruta')}
            className={`flex-1 flex flex-col items-center py-3.5 px-2 relative transition-colors ${
              activeTab === 'ruta'
                ? 'text-theme'
                : 'text-gray-400 hover:text-gray-600'
            }`}
          >
            <div className="relative">
              <Truck className="w-6 h-6 mb-1" />
              {myRouteIds.length > 0 && (
                <span className="absolute -top-2 -right-3 bg-green-500 text-white text-[11px] font-black w-6 h-6 rounded-full flex items-center justify-center border-2 border-white shadow-sm">
                  {myRouteIds.length}
                </span>
              )}
            </div>
            <span className="text-[11px] font-extrabold uppercase tracking-wider">
              Mi Ruta
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
