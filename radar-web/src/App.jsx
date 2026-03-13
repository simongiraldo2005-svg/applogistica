import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, DirectionsRenderer } from '@react-google-maps/api';

// --- CONFIGURACIÓN ---
const MAP_API_KEY = "AIzaSyD8Fk1A0TjWai8vnLE0xGberUtEhVGIW-U"; 

const center = { lat: 6.23, lng: -75.50 };

const clinicsData = [
  { id: 0, name: "CE01 T.S", lat: 6.2308, lng: -75.5905, zone: "CENTRAL" },
  // SUR ALTO
  { id: 1, name: "SAN VICENTE - CALDAS", lat: 6.0911, lng: -75.6358, zone: "SUR ALTO" },
  { id: 2, name: "ANTIOQUIA ITAGÜÍ", lat: 6.1725, lng: -75.6095, zone: "SUR ALTO" },
  { id: 3, name: "SAN RAFAEL ITAGÜÍ", lat: 6.1712, lng: -75.6052, zone: "SUR ALTO" },
  { id: 4, name: "NEUROMÉDICA MAYORCA", lat: 6.1601, lng: -75.6051, zone: "SUR ALTO" },
  { id: 5, name: "CLÍNICA DE LA POLICÍA", lat: 6.2023, lng: -75.5772, zone: "SUR ALTO" },
  { id: 6, name: "CLÍNICA EL CAMPESTRE", lat: 6.2014, lng: -75.5681, zone: "SUR ALTO" },
  { id: 7, name: "CLÍNICA LAS VEGAS", lat: 6.2016, lng: -75.5774, zone: "SUR ALTO" },
  { id: 8, name: "HOSPITAL VENANCIO DÍAZ", lat: 6.1517, lng: -75.6174, zone: "SUR ALTO" },
  { id: 9, name: "MANUEL URIBE ÁNGEL", lat: 6.1691, lng: -75.5843, zone: "SUR ALTO" },
  { id: 10, name: "SAMPEDRO ESTRELLA", lat: 6.1555, lng: -75.6433, zone: "SUR ALTO" },
  { id: 11, name: "STERIL", lat: 6.1550, lng: -75.6100, zone: "SUR ALTO" },
  // SUR BAJO
  { id: 12, name: "CLÍNICA NOEL", lat: 6.2345, lng: -75.5721, zone: "SUR BAJO" },
  { id: 13, name: "FRACTURAS POBLADO", lat: 6.2081, lng: -75.5672, zone: "SUR BAJO" },
  { id: 14, name: "MEDELLÍN POBLADO", lat: 6.2001, lng: -75.5661, zone: "SUR BAJO" },
  { id: 15, name: "INTERQUIRÓFANOS", lat: 6.2005, lng: -75.5665, zone: "SUR BAJO" },
  { id: 16, name: "ROSARIO TESORO", lat: 6.1985, lng: -75.5485, zone: "SUR BAJO" },
  { id: 17, name: "ORTOPEDIA POBLADO", lat: 6.2100, lng: -75.5650, zone: "SUR BAJO" },
  { id: 18, name: "METROSALUD", lat: 6.2150, lng: -75.5750, zone: "SUR BAJO" },
  { id: 19, name: "LAS AMÉRICAS", lat: 6.2215, lng: -75.5942, zone: "SUR BAJO" },
  { id: 20, name: "MEDELLÍN OCCIDENTE", lat: 6.2405, lng: -75.5895, zone: "SUR BAJO" },
  { id: 21, name: "INSTITUTO DEL DOLOR", lat: 6.2410, lng: -75.5710, zone: "SUR BAJO" },
  { id: 22, name: "GENERAL DE MEDELLÍN", lat: 6.2371, lng: -75.5694, zone: "SUR BAJO" },
  { id: 23, name: "ORTOPEDIA ESTADIO", lat: 6.2480, lng: -75.5850, zone: "SUR BAJO" },
  { id: 24, name: "CORPAUL", lat: 6.2250, lng: -75.5800, zone: "SUR BAJO" },
  { id: 25, name: "COOPSANA", lat: 6.2450, lng: -75.5750, zone: "SUR BAJO" },
  // CENTRO
  { id: 26, name: "CENTRAL FUNDADORES", lat: 6.2423, lng: -75.5647, zone: "CENTRO" },
  { id: 27, name: "CLÍNICA SOMA", lat: 6.2455, lng: -75.5641, zone: "CENTRO" },
  { id: 28, name: "SAGRADO CORAZÓN", lat: 6.2422, lng: -75.5563, zone: "CENTRO" },
  { id: 29, name: "ROSARIO CENTRO", lat: 6.2482, lng: -75.5615, zone: "CENTRO" },
  { id: 30, name: "SAN VICENTE MEDELLÍN", lat: 6.2625, lng: -75.5655, zone: "CENTRO" },
  { id: 31, name: "LEÓN XIII", lat: 6.2612, lng: -75.5638, zone: "CENTRO" },
  { id: 32, name: "CONSEJO DE MEDELLÍN", lat: 6.2425, lng: -75.5891, zone: "CENTRO" },
  { id: 33, name: "CLÍNICA CES", lat: 6.2435, lng: -75.5661, zone: "CENTRO" },
  { id: 34, name: "CLÍNICA VIDA", lat: 6.2185, lng: -75.5685, zone: "CENTRO" },
  { id: 35, name: "INSTITUTO NEUROLÓGICO", lat: 6.2618, lng: -75.5635, zone: "CENTRO" },
  { id: 36, name: "IPS PRADO", lat: 6.2571, lng: -75.5612, zone: "CENTRO" },
  // NORTE
  { id: 37, name: "CLÍNICA BOLIVARIANA", lat: 6.2731, lng: -75.5781, zone: "NORTE" },
  { id: 38, name: "PABLO TOBÓN URIBE", lat: 6.2735, lng: -75.5788, zone: "NORTE" },
  { id: 39, name: "HOSPITAL LA MARÍA", lat: 6.2845, lng: -75.5791, zone: "NORTE" },
  { id: 40, name: "ANTIOQUIA BELLO", lat: 6.3312, lng: -75.5574, zone: "NORTE" },
  { id: 41, name: "TERMINAL NORTE", lat: 6.2855, lng: -75.5715, zone: "NORTE" },
  { id: 42, name: "CLÍNICA NORTE", lat: 6.3351, lng: -75.5512, zone: "NORTE" },
  { id: 43, name: "IPS INTEGRADOS", lat: 6.3371, lng: -75.5532, zone: "NORTE" },
  // ORIENTE
  { id: 44, name: "S.J.D RIONEGRO", lat: 6.1512, lng: -75.3735, zone: "ORIENTE" },
  { id: 45, name: "CLÍNICA SOMER", lat: 6.1425, lng: -75.3788, zone: "ORIENTE" },
  { id: 46, name: "NEUROMÉDICA RIONEGRO", lat: 6.1525, lng: -75.3745, zone: "ORIENTE" },
  { id: 47, name: "SAN VICENTE RIONEGRO", lat: 6.1315, lng: -75.3912, zone: "ORIENTE" },
  { id: 48, name: "S.J.D LA CEJA", lat: 6.0315, lng: -75.4312, zone: "ORIENTE" },
  // OCCIDENTE
  { id: 49, name: "S.J.D SANTA FE", lat: 6.5571, lng: -75.8271, zone: "OCCIDENTE" }
];

export default function App() {
  const { isLoaded } = useJsApiLoader({ 
    id: 'google-map-script', 
    googleMapsApiKey: MAP_API_KEY,
    libraries: ['geometry']
  });
  
  const [map, setMap] = useState(null);
  const [origin, setOrigin] = useState(clinicsData[0]);
  const [destination, setDestination] = useState(null);
  const [trafficStates, setTrafficStates] = useState({});
  const [routeData, setRouteData] = useState(null);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  // Calcular Distancia y Tiempo
  const updateRoute = (start, end) => {
    if (!isLoaded || !start || !end) return;
    const service = new window.google.maps.DistanceMatrixService();
    service.getDistanceMatrix({
      origins: [{ lat: start.lat, lng: start.lng }],
      destinations: [{ lat: end.lat, lng: end.lng }],
      travelMode: window.google.maps.TravelMode.DRIVING,
    }, (response, status) => {
      if (status === "OK") {
        const data = response.rows[0].elements[0];
        let durationMin = Math.floor(data.duration.value / 60);
        
        // Sumar tiempo si hay reportes
        const traffic = trafficStates[end.id];
        if (traffic === 'taco') durationMin += 15;
        if (traffic === 'choque') durationMin += 30;

        setRouteData({
          distance: data.distance.text,
          time: durationMin + " min",
          originName: start.name,
          destName: end.name,
          traffic: traffic || "VÍA LIBRE"
        });
      }
    });
  };

  const copyToWhatsApp = () => {
    if (!routeData) return;
    const text = `*REPORTE LOGÍSTICO FLEET* 📡\n\n📍 *Origen:* ${routeData.originName}\n🏁 *Destino:* ${routeData.destName}\n📏 *Distancia:* ${routeData.distance}\n⏱️ *Tiempo Est:* ${routeData.time}\n⚠️ *Estado:* ${routeData.traffic.toUpperCase()}\n\n_Generado por Radar Fleet Medellín_`;
    
    const el = document.createElement('textarea');
    el.value = text;
    document.body.appendChild(el);
    el.select();
    document.execCommand('copy');
    document.body.removeChild(el);
    
    const btn = document.getElementById('copyBtn');
    btn.innerText = "✅ ¡COPIADO!";
    setTimeout(() => btn.innerText = "COPIAR MENSAJE WHATSAPP", 2000);
  };

  const toggleStatus = (id, type) => {
    const newState = trafficStates[id] === type ? null : type;
    setTrafficStates(prev => ({ ...prev, [id]: newState }));
    // Si la clínica afectada es el destino actual, actualizamos la ruta
    if (destination && destination.id === id) {
        setTimeout(() => updateRoute(origin, destination), 100);
    }
  };

  const filteredClinics = clinicsData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    c.zone.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex h-screen bg-[#020617] text-slate-100 font-sans overflow-hidden">
      
      {/* SIDEBAR COLAPSABLE */}
      <aside className={`transition-all duration-300 z-30 bg-[#0f172a]/95 backdrop-blur-md border-r border-blue-500/20 flex flex-col shadow-2xl ${sidebarOpen ? 'w-80' : 'w-0 -translate-x-full'}`}>
        <div className="p-4 flex flex-col h-full w-80">
          <header className="mb-4">
            <h1 className="text-2xl font-black italic text-blue-400 tracking-tighter">RADAR FLEET</h1>
            <p className="text-[9px] font-bold text-slate-500 uppercase tracking-[0.2em]">Sincronización Logística</p>
          </header>

          <div className="space-y-4 flex-1 overflow-y-auto pr-2 custom-scrollbar">
            {/* SELECTORES DE RUTA */}
            <div className="bg-[#1e293b]/50 p-3 rounded-2xl border border-slate-800">
              <label className="text-[10px] font-black text-blue-500 uppercase">Punto de Salida</label>
              <select 
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-xs outline-none mt-1 mb-3"
                onChange={(e) => {
                    const org = clinicsData.find(c => c.id === parseInt(e.target.value));
                    setOrigin(org);
                    if (destination) updateRoute(org, destination);
                }}
                value={origin?.id}
              >
                {clinicsData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label className="text-[10px] font-black text-green-500 uppercase block">Punto de Llegada</label>
              <select 
                className="w-full bg-[#0f172a] border border-slate-700 rounded-lg p-2 text-xs outline-none mt-1"
                onChange={(e) => {
                    const dest = clinicsData.find(c => c.id === parseInt(e.target.value));
                    setDestination(dest);
                    updateRoute(origin, dest);
                    if(map) map.panTo({lat: dest.lat, lng: dest.lng});
                }}
                value={destination?.id || ""}
              >
                <option value="" disabled>Seleccionar clínica...</option>
                {clinicsData.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </div>

            {/* BUSCADOR */}
            <input 
              type="text"
              placeholder="🔍 Filtrar clínicas..."
              className="w-full bg-[#1e293b] border border-slate-700 rounded-xl py-2 px-4 text-xs outline-none focus:border-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            {/* LISTA COMPACTA CON ALERTAS */}
            <div className="space-y-1.5">
              <p className="text-[9px] font-black text-slate-500 uppercase mb-2">Reportar Novedad</p>
              {filteredClinics.map(clinic => (
                <div key={clinic.id} className={`bg-[#1e293b]/30 p-2.5 rounded-xl border transition-all ${destination?.id === clinic.id ? 'border-blue-500/50' : 'border-slate-800'}`}>
                  <div className="flex justify-between items-center mb-2">
                    <p className="text-[10px] font-bold uppercase truncate pr-2">{clinic.name}</p>
                    <span className="text-[7px] bg-slate-800 px-1 py-0.5 rounded text-slate-400">{clinic.zone}</span>
                  </div>
                  <div className="flex gap-1">
                    <button 
                      onClick={() => toggleStatus(clinic.id, 'taco')}
                      className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase transition-all border ${trafficStates[clinic.id] === 'taco' ? 'bg-orange-600 border-orange-400' : 'bg-slate-800 border-transparent text-slate-500'}`}
                    >
                      Taco
                    </button>
                    <button 
                      onClick={() => toggleStatus(clinic.id, 'choque')}
                      className={`flex-1 py-1 rounded-lg text-[8px] font-black uppercase transition-all border ${trafficStates[clinic.id] === 'choque' ? 'bg-red-600 border-red-400' : 'bg-slate-800 border-transparent text-slate-500'}`}
                    >
                      Choque
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* PANEL DE RESULTADO WHATSAPP */}
          {routeData && (
            <div className="mt-4 p-4 bg-blue-600/10 border border-blue-500/30 rounded-2xl animate-in slide-in-from-bottom-2">
              <div className="grid grid-cols-2 gap-2 mb-3">
                <div className="text-center">
                  <p className="text-[8px] text-slate-400 uppercase">Distancia</p>
                  <p className="text-sm font-black text-blue-400">{routeData.distance}</p>
                </div>
                <div className="text-center border-l border-slate-700">
                  <p className="text-[8px] text-slate-400 uppercase">Tiempo Est.</p>
                  <p className="text-sm font-black text-green-400">{routeData.time}</p>
                </div>
              </div>
              <button 
                id="copyBtn"
                onClick={copyToWhatsApp}
                className="w-full py-3 bg-green-600 hover:bg-green-700 rounded-xl text-[9px] font-black uppercase tracking-widest transition-all shadow-lg shadow-green-900/20"
              >
                COPIAR MENSAJE WHATSAPP
              </button>
            </div>
          )}
        </div>
      </aside>

      {/* MAPA PRINCIPAL (PROTAGONISTA) */}
      <main className="flex-1 relative">
        <button 
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="absolute top-4 left-4 z-40 bg-slate-900/80 backdrop-blur border border-slate-700 p-2.5 rounded-xl shadow-2xl hover:bg-blue-600 transition-all group"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400 group-hover:text-white"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>

        {isLoaded ? (
          <GoogleMap
            mapContainerStyle={{ width: '100%', height: '100%' }}
            center={center}
            zoom={12}
            onLoad={setMap}
            options={{ 
                styles: darkMapStyle, 
                disableDefaultUI: true, 
                zoomControl: true,
                clickableIcons: false
            }}
          >
            {clinicsData.map(clinic => (
              <Marker
                key={clinic.id}
                position={{ lat: clinic.lat, lng: clinic.lng }}
                onClick={() => {
                    setDestination(clinic);
                    updateRoute(origin, clinic);
                }}
                icon={{
                  path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                  fillColor: trafficStates[clinic.id] === 'choque' ? '#ef4444' : (trafficStates[clinic.id] === 'taco' ? '#f97316' : (clinic.id === 0 ? '#facc15' : '#3b82f6')),
                  fillOpacity: 1,
                  strokeWeight: 2,
                  strokeColor: "#ffffff",
                  scale: (destination?.id === clinic.id || origin?.id === clinic.id) ? 1.8 : 1.2,
                }}
              />
            ))}
          </GoogleMap>
        ) : (
          <div className="h-full flex flex-col items-center justify-center bg-slate-950">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-500 mb-4"></div>
            <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">Iniciando Radar...</p>
          </div>
        )}
      </main>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 3px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .gm-control-active { border-radius: 8px !important; }
      `}} />
    </div>
  );
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] }
];