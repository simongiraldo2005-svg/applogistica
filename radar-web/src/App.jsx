import React, { useState, useCallback } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';

const MAP_API_KEY = ""; // La API Key se inyecta automáticamente en este entorno

// Coordenadas centrales de la zona metropolitana
const center = {
  lat: 6.18,
  lng: -75.50
};

const clinicsData = [
  // VALLE DE ABURRÁ
  { id: 1, name: "SEDE PRINCIPAL FLEET", lat: 6.2308, lng: -75.5905, area: "Medellín" },
  { id: 2, name: "HOSPITAL SAN VICENTE - CALDAS", lat: 6.0911, lng: -75.6358, area: "Sur" },
  { id: 3, name: "CLÍNICA ANTIOQUIA ITAGÜÍ", lat: 6.1725, lng: -75.6095, area: "Sur" },
  { id: 4, name: "HOSPITAL SAN RAFAEL ITAGÜÍ", lat: 6.1712, lng: -75.6052, area: "Sur" },
  { id: 5, name: "CLÍNICA LAS AMÉRICAS", lat: 6.2215, lng: -75.5942, area: "Medellín" },
  { id: 6, name: "HOSPITAL PABLO TOBÓN URIBE", lat: 6.2735, lng: -75.5788, area: "Medellín" },
  { id: 7, name: "CLÍNICA CARDIOVID", lat: 6.2755, lng: -75.5765, area: "Medellín" },
  { id: 8, name: "CLÍNICA EL ROSARIO (CENTRO)", lat: 6.2482, lng: -75.5615, area: "Medellín" },
  { id: 10, name: "CLÍNICA MEDELLÍN OCCIDENTE", lat: 6.2405, lng: -75.5895, area: "Medellín" },
  { id: 11, name: "CLÍNICA NOEL", lat: 6.2345, lng: -75.5721, area: "Medellín" },
  { id: 12, name: "CLÍNICA VIDA", lat: 6.2185, lng: -75.5685, area: "Medellín" },
  
  // ORIENTE ANTIOQUEÑO
  { id: 20, name: "CLÍNICA SOMER - RIONEGRO", lat: 6.1425, lng: -75.3788, area: "Oriente" },
  { id: 21, name: "HOSPITAL SAN VICENTE FUNDACIÓN - RIONEGRO", lat: 6.1315, lng: -75.3912, area: "Oriente" },
  { id: 22, name: "HOSPITAL SAN JUAN DE DIOS - RIONEGRO", lat: 6.1512, lng: -75.3735, area: "Oriente" },
  { id: 23, name: "CLÍNICA SAN JUAN DE DIOS - LA CEJA", lat: 6.0315, lng: -75.4312, area: "Oriente" },
  { id: 24, name: "HOSPITAL SAN JUAN DE DIOS - MARINILLA", lat: 6.1742, lng: -75.3355, area: "Oriente" }
];

const containerStyle = {
  width: '100%',
  height: '100%'
};

export default function App() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: MAP_API_KEY
  });

  const [map, setMap] = useState(null);
  const [selectedClinic, setSelectedClinic] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const onLoad = useCallback(function callback(map) {
    setMap(map);
  }, []);

  const handleClinicClick = (clinic) => {
    setSelectedClinic(clinic);
    if (map) {
      map.panTo({ lat: clinic.lat, lng: clinic.lng });
      map.setZoom(16);
    }
    // En móviles cerramos el sidebar automáticamente al elegir
    if (window.innerWidth < 768) setSidebarOpen(false);
  };

  const filteredClinics = clinicsData.filter(c => 
    c.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col h-screen bg-[#0f172a] text-white font-sans overflow-hidden">
      {/* Header Compacto */}
      <header className="p-3 bg-[#1e293b] shadow-xl flex justify-between items-center z-30 border-b border-blue-500/30">
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-slate-700 rounded-lg transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div>
            <h1 className="text-lg font-black tracking-tighter text-blue-400 italic leading-none">RADAR FLEET</h1>
            <p className="text-[9px] text-gray-400 uppercase tracking-widest mt-1">Sincronización Logística</p>
          </div>
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        {/* Sidebar Lateral */}
        <aside className={`
          absolute md:relative z-20 h-full bg-[#0f172a] border-r border-blue-900/50 
          transition-all duration-300 ease-in-out
          ${sidebarOpen ? 'w-full md:w-80 translate-x-0' : 'w-0 -translate-x-full md:translate-x-0 md:w-0'}
        `}>
          <div className="p-4 flex flex-col h-full w-80">
            <input 
              type="text"
              placeholder="🔍 Buscar clínica..."
              className="w-full bg-[#1e293b] border border-blue-900/50 rounded-xl py-2.5 px-4 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="flex-1 overflow-y-auto space-y-2 pr-1 custom-scrollbar">
              {filteredClinics.map((clinic) => (
                <button
                  key={clinic.id}
                  onClick={() => handleClinicClick(clinic)}
                  className={`w-full text-left p-4 rounded-xl transition-all border flex items-center justify-between group ${
                    selectedClinic?.id === clinic.id 
                    ? 'bg-blue-600 border-blue-400 shadow-lg shadow-blue-900/40' 
                    : 'bg-[#1e293b]/40 border-slate-800 hover:border-blue-700 hover:bg-slate-800'
                  }`}
                >
                  <span className={`text-[11px] font-bold uppercase tracking-tight leading-tight ${
                    selectedClinic?.id === clinic.id ? 'text-white' : 'text-slate-200'
                  }`}>
                    {clinic.name}
                  </span>
                  <span className={`text-[8px] px-1.5 py-0.5 rounded font-black ${
                    selectedClinic?.id === clinic.id ? 'bg-blue-400 text-blue-900' : 'bg-slate-700 text-slate-400'
                  }`}>
                    {clinic.area}
                  </span>
                </button>
              ))}
            </div>

            <div className="mt-4 pt-4 border-t border-slate-800">
              <button 
                onClick={() => {
                  if(map) { map.panTo(center); map.setZoom(10); }
                }}
                className="w-full py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-[10px] font-black tracking-widest uppercase transition-all"
              >
                RESTABLECER VISTA
              </button>
            </div>
          </div>
        </aside>

        {/* Área del Mapa */}
        <main className="flex-1 relative h-full">
          {isLoaded ? (
            <GoogleMap
              mapContainerStyle={containerStyle}
              center={center}
              zoom={10}
              onLoad={onLoad}
              options={{
                styles: darkMapStyle,
                disableDefaultUI: false,
                zoomControl: true,
                mapTypeControl: false,
                streetViewControl: false,
                fullscreenControl: false
              }}
            >
              {clinicsData.map(clinic => (
                <Marker
                  key={clinic.id}
                  position={{ lat: clinic.lat, lng: clinic.lng }}
                  onClick={() => handleClinicClick(clinic)}
                  icon={{
                    path: "M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z",
                    fillColor: selectedClinic?.id === clinic.id ? "#60a5fa" : "#3b82f6",
                    fillOpacity: 1,
                    strokeWeight: 2,
                    strokeColor: "#ffffff",
                    scale: 1.6,
                  }}
                />
              ))}

              {selectedClinic && (
                <InfoWindow
                  position={{ lat: selectedClinic.lat, lng: selectedClinic.lng }}
                  onCloseClick={() => setSelectedClinic(null)}
                >
                  <div className="text-slate-900 p-2 min-w-[140px]">
                    <h3 className="font-black text-[10px] border-b border-slate-200 pb-1 mb-2 uppercase text-blue-700">
                      {selectedClinic.name}
                    </h3>
                    <a 
                      href={`https://www.google.com/maps/dir/?api=1&destination=${selectedClinic.lat},${selectedClinic.lng}`}
                      target="_blank"
                      rel="noreferrer"
                      className="block w-full text-center py-2 bg-slate-900 text-white rounded-lg text-[9px] font-black uppercase tracking-tighter"
                    >
                      TRAZAR RUTA
                    </a>
                  </div>
                </InfoWindow>
              )}
            </GoogleMap>
          ) : (
            <div className="h-full w-full flex items-center justify-center bg-[#0f172a]">
              <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          )}
        </main>
      </div>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #3b82f6; }
        .gm-style-iw { border-radius: 12px !important; padding: 0 !important; }
        .gm-style-iw-d { overflow: hidden !important; }
        .gm-ui-hover-text { display: none !important; }
      `}} />
    </div>
  );
}

const darkMapStyle = [
  { "elementType": "geometry", "stylers": [{ "color": "#1d2c4d" }] },
  { "elementType": "labels.text.fill", "stylers": [{ "color": "#8ec3b9" }] },
  { "elementType": "labels.text.stroke", "stylers": [{ "color": "#1a3646" }] },
  { "featureType": "administrative.country", "elementType": "geometry.stroke", "stylers": [{ "color": "#4b6878" }] },
  { "featureType": "landscape.man_made", "elementType": "geometry.stroke", "stylers": [{ "color": "#334e87" }] },
  { "featureType": "road", "elementType": "geometry", "stylers": [{ "color": "#304a7d" }] },
  { "featureType": "road", "elementType": "labels.text.fill", "stylers": [{ "color": "#98a5be" }] },
  { "featureType": "road.highway", "elementType": "geometry", "stylers": [{ "color": "#2c6675" }] },
  { "featureType": "water", "elementType": "geometry", "stylers": [{ "color": "#0e1626" }] }
];