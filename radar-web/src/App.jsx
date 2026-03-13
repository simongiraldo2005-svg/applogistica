import React, { useState, useEffect, useRef } from 'react';

// 👇 TU LLAVE MAESTRA
const GOOGLE_MAPS_API_KEY = "AIzaSyD8Fk1A0TjWai8vnLE0xGberUtEhVGIW-U"; 

// Ubicación de tu Sede Principal (Terminal del Sur)
const SEDE_PRINCIPAL = { 
  name: "★ SEDE PRINCIPAL FLEET", 
  lat: 6.2217, 
  lng: -75.5866,
  address: "Cra. 65 # 8b - 91 local 648116 (Terminal Sur)"
}; 

const CLINICAS_LISTA = [
  SEDE_PRINCIPAL,
  { name: "Hospital San Vicente - Caldas", zone: "SUR", lat: 6.0912, lng: -75.6358 }, { name: "Clinica Antioquia Itagui", zone: "SUR", lat: 6.1732, lng: -75.6085 }, { name: "Hospital San Rafael Itagui", zone: "SUR", lat: 6.1725, lng: -75.6095 }, { name: "Neuromedica - Mayorca", zone: "SUR", lat: 6.1612, lng: -75.6050 }, { name: "Clinica de la Policia", zone: "SUR", lat: 6.1850, lng: -75.5850 }, { name: "Clinica El Campestre", zone: "SUR", lat: 6.1950, lng: -75.5780 }, { name: "Clinica Las Vegas", zone: "SUR", lat: 6.2030, lng: -75.5790 }, { name: "Hospital Venancio Diaz", zone: "SUR", lat: 6.1550, lng: -75.6150 }, { name: "Manuel Uribe Angel", zone: "SUR", lat: 6.1710, lng: -75.5820 }, { name: "Sampedro Estrella", zone: "SUR", lat: 6.1580, lng: -75.6420 }, { name: "Steril", zone: "SUR", lat: 6.1650, lng: -75.6020 },
  { name: "Clinica Noel", zone: "SUR BAJO", lat: 6.2280, lng: -75.5750 }, { name: "Fracturas Poblado", zone: "SUR BAJO", lat: 6.2050, lng: -75.5650 }, { name: "Clinica Medellin Poblado", zone: "SUR BAJO", lat: 6.2080, lng: -75.5680 }, { name: "Interquirofanos", zone: "SUR BAJO", lat: 6.2150, lng: -75.5620 }, { name: "Clinica Rosario Tesoro", zone: "SUR BAJO", lat: 6.1980, lng: -75.5580 }, { name: "Centro Ortopedia El Poblado", zone: "SUR BAJO", lat: 6.2110, lng: -75.5710 }, { name: "Metrosalud", zone: "SUR BAJO", lat: 6.2250, lng: -75.5820 }, { name: "Clinica Las Americas", zone: "SUR BAJO", lat: 6.2220, lng: -75.5910 }, { name: "Clinica Medellin Occidente", zone: "SUR BAJO", lat: 6.2280, lng: -75.5950 }, { name: "Instituto Del Dolor", zone: "SUR BAJO", lat: 6.2310, lng: -75.5850 }, { name: "Hospital General", zone: "SUR BAJO", lat: 6.2380, lng: -75.5690 }, { name: "Centro Ortopedia Estadio", zone: "SUR BAJO", lat: 6.2520, lng: -75.5850 }, { name: "Corpaul", zone: "SUR BAJO", lat: 6.2410, lng: -75.5720 }, { name: "Coopsana", zone: "SUR BAJO", lat: 6.2180, lng: -75.5750 },
  { name: "Clinica Central Fundadores", zone: "CENTRO", lat: 6.2510, lng: -75.5610 }, { name: "Clinica Soma", zone: "CENTRO", lat: 6.2480, lng: -75.5650 }, { name: "Clinica Sagrado Corazón", zone: "CENTRO", lat: 6.2350, lng: -75.5550 }, { name: "Clinica Rosario Centro", zone: "CENTRO", lat: 6.2450, lng: -75.5580 }, { name: "Fundacion San Vicente Paul", zone: "CENTRO", lat: 6.2580, lng: -75.5650 }, { name: "Clinica Leon XIII", zone: "CENTRO", lat: 6.2610, lng: -75.5620 }, { name: "Consejo de Medellin", zone: "CENTRO", lat: 6.2420, lng: -75.5780 }, { name: "Clinica CES", zone: "CENTRO", lat: 6.2450, lng: -75.5750 }, { name: "Clinica Vida", zone: "CENTRO", lat: 6.2310, lng: -75.5620 }, { name: "Instituto Neurologico", zone: "CENTRO", lat: 6.2550, lng: -75.5580 }, { name: "IPS Prado", zone: "CENTRO", lat: 6.2580, lng: -75.5550 },
  { name: "Clinica Bolivariana", zone: "NORTE", lat: 6.2480, lng: -75.5890 }, { name: "Hospital Pablo Tobón Uribe", zone: "NORTE", lat: 6.2680, lng: -75.5790 }, { name: "Hospital La María", zone: "NORTE", lat: 6.2850, lng: -75.5750 }, { name: "Clinica Antioquia Bello", zone: "NORTE", lat: 6.3310, lng: -75.5550 }, { name: "Terminal Norte", zone: "NORTE", lat: 6.2820, lng: -75.5650 }, { name: "Clinica Norte", zone: "NORTE", lat: 6.3350, lng: -75.5580 }, { name: "IPS Integrados", zone: "NORTE", lat: 6.3250, lng: -75.5520 }
];

export default function App() {
  const mapRef = useRef(null);
  const [map, setMap] = useState(null);
  const [directionsRenderer, setDirectionsRenderer] = useState(null);
  const [activeTab, setActiveTab] = useState('lista');
  const [busqueda, setBusqueda] = useState('');
  const [origen, setOrigen] = useState(SEDE_PRINCIPAL.name);
  const [destino, setDestino] = useState('');
  const [resultadoRuta, setResultadoRuta] = useState(null);
  const [cargandoRuta, setCargandoRuta] = useState(false);
  const [copyStatus, setCopyStatus] = useState(false);

  useEffect(() => {
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
    script.async = true;
    script.onload = () => {
      if (!mapRef.current) return;
      const gMap = new window.google.maps.Map(mapRef.current, {
        center: { lat: SEDE_PRINCIPAL.lat, lng: SEDE_PRINCIPAL.lng },
        zoom: 13,
        styles: [{ elementType: "geometry", stylers: [{ color: "#242f3e" }] }, { featureType: "road", elementType: "geometry", stylers: [{ color: "#38414e" }] }, { featureType: "water", elementType: "geometry", stylers: [{ color: "#17263c" }] }, { featureType: "poi", stylers: [{ visibility: "off" }] }],
        disableDefaultUI: true,
      });
      const trafficLayer = new window.google.maps.TrafficLayer();
      trafficLayer.setMap(gMap);
      const dRenderer = new window.google.maps.DirectionsRenderer({ map: gMap, suppressMarkers: true, polylineOptions: { strokeColor: "#3b82f6", strokeWeight: 6, strokeOpacity: 0.9 } });
      setDirectionsRenderer(dRenderer);
      CLINICAS_LISTA.forEach(c => {
        const isSede = c.name.includes("SEDE PRINCIPAL");
        new window.google.maps.Marker({
          position: { lat: c.lat, lng: c.lng },
          map: gMap,
          label: { text: c.name, color: "#ffffff", fontSize: isSede ? "11px" : "9px", fontWeight: "bold", className: isSede ? "label-sede" : "label-clinica" },
          icon: { path: window.google.maps.SymbolPath.CIRCLE, scale: 5, fillColor: isSede ? "#f87171" : "#3b82f6", fillOpacity: 1, strokeColor: "#ffffff", strokeWeight: 1 }
        });
      });
      setMap(gMap);
    };
    document.head.appendChild(script);
  }, []);

  const calcularRuta = () => {
    if (!origen || !destino || origen === destino) return;
    setCargandoRuta(true);
    setResultadoRuta(null);
    const ds = new window.google.maps.DirectionsService();
    const cO = CLINICAS_LISTA.find(c => c.name === origen);
    const cD = CLINICAS_LISTA.find(c => c.name === destino);

    ds.route({
      origin: { lat: cO.lat, lng: cO.lng },
      destination: { lat: cD.lat, lng: cD.lng },
      travelMode: 'DRIVING',
      drivingOptions: { departureTime: new Date(), trafficModel: 'pessimistic' }
    }, (res, status) => {
      setCargandoRuta(false);
      if (status === 'OK') {
        directionsRenderer.setDirections(res);
        const leg = res.routes[0].legs[0];
        const tNormal = leg.duration.value;
        const tTrafico = leg.duration_in_traffic ? leg.duration_in_traffic.value : tNormal;
        const dif = Math.round((tTrafico - tNormal) / 60);

        let avisoReal = "✅ RUTA EXCELENTE / VÍA LIBRE";
        let esCierre = false;
        let esChoque = false;
        let esTaco = false;

        // 1. Revisar avisos oficiales de Google
        if (res.routes[0].warnings && res.routes[0].warnings.length > 0) {
          const warnText = res.routes[0].warnings.join(" ").toLowerCase();
          if (warnText.includes("cerrada") || warnText.includes("cierre") || warnText.includes("obras")) {
            avisoReal = "⛔ VÍA CERRADA / BLOQUEO";
            esCierre = true;
          }
        }

        // 2. Clasificar por tiempo de retraso real
        if (!esCierre) {
          if (dif >= 18) {
            avisoReal = "💥 CHOQUE DETECTADO";
            esChoque = true;
          } else if (dif >= 8) {
            avisoReal = "🚗 TACO MUY PESADO";
            esTaco = true;
          } else if (dif > 2) {
            avisoReal = "⚠️ TRÁFICO LENTO";
            esTaco = true;
          }
        }

        setResultadoRuta({
          distancia: leg.distance.text,
          tiempo: leg.duration_in_traffic ? leg.duration_in_traffic.text : leg.duration.text,
          retraso: dif > 0 ? dif : 0,
          diagnostico: avisoReal,
          clinicaO: cO.name,
          clinicaD: cD.name,
          esCierre,
          esChoque,
          esTaco
        });

        map.setCenter({ lat: cD.lat, lng: cD.lng });
        map.setZoom(14);
      }
    });
  };

  const reportarWhatsApp = async (tipoCustom = null) => {
    let msg = "";
    if (resultadoRuta) {
      const { clinicaO, clinicaD, diagnostico, distancia, tiempo, retraso } = resultadoRuta;
      msg = `🚨 *CENTRAL FLEET: REPORTE DE RUTA*\n\n🛫 *ORIGEN:* ${clinicaO}\n🛬 *DESTINO:* ${clinicaD}\n🚦 *ESTADO:* ${diagnostico}\n📏 *DISTANCIA:* ${distancia}\n⏳ *TIEMPO ESTIMADO:* ${tiempo}\n⚠️ *DEMORA:* ${retraso} min.\n\n👉 _Conductores Fleet, sigan las instrucciones de ruta._`;
    } else {
      msg = `🚨 *REPORTE RÁPIDO FLEET:* ${tipoCustom}`;
    }
    await navigator.clipboard.writeText(msg);
    setCopyStatus(true);
    setTimeout(() => setCopyStatus(false), 3000);
    window.open('https://web.whatsapp.com/', '_blank');
  };

  const filtradas = CLINICAS_LISTA.filter(c => c.name.toLowerCase().includes(busqueda.toLowerCase()));

  return (
    <div className="flex h-screen bg-black text-white font-sans overflow-hidden text-left relative">
      <style>{`
        .label-clinica { background: rgba(0,0,0,0.7); padding: 2px 5px; border-radius: 4px; white-space: nowrap; }
        .label-sede { background: rgba(239,68,68,0.8); padding: 3px 6px; border-radius: 4px; white-space: nowrap; border: 1px solid white; }
      `}</style>
      
      {copyStatus && (
        <div className="fixed top-6 right-6 bg-green-600 px-6 py-4 rounded-xl shadow-2xl z-[9999] border-2 border-green-400 font-bold animate-bounce">
          ✅ ¡Reporte Copiado! Pégalo en WhatsApp
        </div>
      )}

      {/* PANEL LATERAL */}
      <div className="w-[420px] bg-gray-900 border-r border-gray-800 flex flex-col shadow-2xl z-10">
        <div className="p-6 bg-black border-b border-gray-800">
          <h1 className="text-xl font-black text-red-500 uppercase italic tracking-tighter leading-none">Radar Fleet Medellín</h1>
          <p className="text-[9px] text-gray-500 font-bold mt-2 uppercase tracking-widest leading-none">Sincronización de Flota 24/7</p>
          <div className="flex bg-gray-800 p-1 rounded-lg mt-5">
            <button onClick={() => setActiveTab('lista')} className={`flex-1 py-2 text-[10px] font-bold rounded-md transition ${activeTab === 'lista' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>LISTADO</button>
            <button onClick={() => setActiveTab('escaner')} className={`flex-1 py-2 text-[10px] font-bold rounded-md transition ${activeTab === 'escaner' ? 'bg-blue-600 text-white' : 'text-gray-400'}`}>ESCANEAR RUTA</button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          {activeTab === 'lista' ? (
            <div className="space-y-3">
              <input type="text" placeholder="🔍 Buscar clínica..." className="w-full bg-gray-800 border border-gray-700 rounded-xl p-3 text-sm mb-4 outline-none focus:border-blue-500" onChange={e => setBusqueda(e.target.value)} />
              {filtradas.map((c, i) => (
                <div key={i} className={`p-4 rounded-xl border transition cursor-pointer ${c.name.includes("SEDE") ? 'bg-red-900/10 border-red-500 shadow-[inset_0_0_10px_rgba(239,68,68,0.1)]' : 'bg-gray-800/40 border-gray-800 hover:border-blue-500'}`} onClick={() => { map.setCenter({lat: c.lat, lng: c.lng}); map.setZoom(16); }}>
                  <h3 className="text-sm font-bold uppercase leading-tight">{c.name}</h3>
                  <div className="flex gap-1 mt-3">
                    <button onClick={(e) => { e.stopPropagation(); reportarWhatsApp(`🚨 TACO PESADO en zona ${c.name}`); }} className="flex-1 bg-orange-600 text-[9px] font-bold py-2 rounded">🚗 TACO</button>
                    <button onClick={(e) => { e.stopPropagation(); reportarWhatsApp(`💥 CHOQUE / ACCIDENTE en zona ${c.name}`); }} className="flex-1 bg-red-700 text-[9px] font-bold py-2 rounded">💥 CHOQUE</button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              <div className="bg-gray-800/50 p-5 rounded-2xl border border-gray-700">
                <p className="text-[10px] font-bold text-blue-400 mb-4 uppercase tracking-widest">Analizador de Trayecto</p>
                <select className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl text-sm mb-3" value={origen} onChange={e => setOrigen(e.target.value)}>
                  {CLINICAS_LISTA.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <select className="w-full bg-gray-900 border border-gray-700 p-3 rounded-xl text-sm mb-4" value={destino} onChange={e => setDestino(e.target.value)}>
                  <option value="">Hacia clínica...</option>
                  {CLINICAS_LISTA.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                </select>
                <button onClick={calcularRuta} disabled={cargandoRuta || !destino} className="w-full bg-blue-600 py-4 rounded-xl font-bold text-sm shadow-lg active:scale-95 transition">
                  {cargandoRuta ? '🔄 ANALIZANDO SATÉLITES...' : '⚡ ESCANEAR AHORA'}
                </button>
              </div>

              {resultadoRuta && (
                <div className={`bg-gray-800 p-5 rounded-2xl border-l-4 animate-in fade-in slide-in-from-top-4 duration-500 ${resultadoRuta.esCierre ? 'border-l-red-600' : resultadoRuta.esChoque ? 'border-l-red-500' : resultadoRuta.esTaco ? 'border-l-orange-500' : 'border-l-green-500'}`}>
                  <div className={`p-3 rounded-lg font-black text-xs text-center mb-4 ${resultadoRuta.esCierre ? 'bg-red-800 animate-pulse' : resultadoRuta.esChoque ? 'bg-red-600' : resultadoRuta.esTaco ? 'bg-orange-600' : 'bg-green-600'}`}>
                    {resultadoRuta.diagnostico}
                  </div>
                  <div className="space-y-3 text-sm">
                    <div className="flex justify-between border-b border-gray-700 pb-2"><span>Distancia Real:</span><span className="font-bold text-white text-lg">{resultadoRuta.distancia}</span></div>
                    <div className="flex justify-between border-b border-gray-700 pb-2"><span>Tiempo Estimado:</span><span className="font-bold text-blue-400">{resultadoRuta.tiempo}</span></div>
                    <div className="flex justify-between"><span>Demora por Tráfico:</span><span className={`font-bold ${resultadoRuta.retraso > 5 ? 'text-red-500' : 'text-green-500'}`}>+{resultadoRuta.retraso} min</span></div>
                    <button onClick={() => reportarWhatsApp()} className="w-full bg-[#25D366] py-3 rounded-xl font-black text-xs mt-4 flex items-center justify-center gap-2 shadow-xl active:scale-95">💬 INFORMAR A CONDUCTORES</button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 relative">
        <div ref={mapRef} className="w-full h-full" />
        <div className="absolute top-6 right-6 bg-black/90 p-4 rounded-xl border border-gray-800 text-[10px] font-bold space-y-2 backdrop-blur-sm">
           <div className="flex items-center gap-3"><div className="w-4 h-4 bg-green-500 rounded"></div> ✅ Vía Libre</div>
           <div className="flex items-center gap-3"><div className="w-4 h-4 bg-orange-500 rounded"></div> 🚗 Tráfico Lento</div>
           <div className="flex items-center gap-3"><div className="w-4 h-4 bg-red-600 rounded"></div> 💥 Choque Detec.</div>
           <div className="flex items-center gap-3"><div className="w-4 h-4 bg-red-800 rounded animate-pulse"></div> ⛔ Vía Cerrada</div>
        </div>
      </div>
    </div>
  );
}