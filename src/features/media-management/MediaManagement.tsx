import { useState } from "react";
import "./MediaManegment.css";

const MediaManagement = () => {
  const [showModal, setShowModal] = useState(false);
  const [mediaSamples, setMediaSamples] = useState([
    { nombre: "El País", url: "https://elpais.com", pais: "España", categoria: "General", descripcion: "Diario español de información general" },
    { nombre: "The New York Times", url: "https://nytimes.com", pais: "Estados Unidos", categoria: "General", descripcion: "Periódico estadounidense de referencia" },
    { nombre: "BBC News", url: "https://bbc.com/news", pais: "Reino Unido", categoria: "Internacional", descripcion: "Servicio de noticias de la BBC" },
    { nombre: "Le Monde", url: "https://lemonde.fr", pais: "Francia", categoria: "General", descripcion: "Diario francés de referencia" },
    { nombre: "CNN", url: "https://cnn.com", pais: "Estados Unidos", categoria: "Televisión", descripcion: "Canal de noticias 24 horas" },
    { nombre: "The Guardian", url: "https://theguardian.com", pais: "Reino Unido", categoria: "General", descripcion: "Periódico británico progresista" },
    { nombre: "Reuters", url: "https://reuters.com", pais: "Reino Unido", categoria: "Agencia", descripcion: "Agencia internacional de noticias" },
    { nombre: "Associated Press", url: "https://apnews.com", pais: "Estados Unidos", categoria: "Agencia", descripcion: "Agencia de noticias estadounidense" },
    { nombre: "La Nación", url: "https://lanacion.com.ar", pais: "Argentina", categoria: "General", descripcion: "Diario argentino tradicional" },
    { nombre: "Clarín", url: "https://clarin.com", pais: "Argentina", categoria: "General", descripcion: "Principal diario de Argentina" },
    { nombre: "El Universal", url: "https://eluniversal.com.mx", pais: "México", categoria: "General", descripcion: "Periódico mexicano de circulación nacional" },
    { nombre: "O Globo", url: "https://oglobo.globo.com", pais: "Brasil", categoria: "General", descripcion: "Diario brasileño de Río de Janeiro" },
    { nombre: "Folha de S.Paulo", url: "https://folha.uol.com.br", pais: "Brasil", categoria: "General", descripcion: "Principal periódico de Brasil" },
    { nombre: "El Tiempo", url: "https://eltiempo.com", pais: "Colombia", categoria: "General", descripcion: "Periódico colombiano líder" },
    { nombre: "Der Spiegel", url: "https://spiegel.de", pais: "Alemania", categoria: "Revista", descripcion: "Revista semanal alemana" },
    { nombre: "Die Zeit", url: "https://zeit.de", pais: "Alemania", categoria: "General", descripcion: "Semanario alemán de calidad" },
    { nombre: "La Repubblica", url: "https://repubblica.it", pais: "Italia", categoria: "General", descripcion: "Diario italiano progresista" },
    { nombre: "Corriere della Sera", url: "https://corriere.it", pais: "Italia", categoria: "General", descripcion: "Periódico italiano histórico" },
    { nombre: "El Mundo", url: "https://elmundo.es", pais: "España", categoria: "General", descripcion: "Diario español de información general" },
    { nombre: "ABC", url: "https://abc.es", pais: "España", categoria: "General", descripcion: "Periódico español conservador" },
    { nombre: "Financial Times", url: "https://ft.com", pais: "Reino Unido", categoria: "Economía", descripcion: "Diario económico internacional" },
    { nombre: "The Wall Street Journal", url: "https://wsj.com", pais: "Estados Unidos", categoria: "Economía", descripcion: "Periódico económico estadounidense" },
    { nombre: "Bloomberg", url: "https://bloomberg.com", pais: "Estados Unidos", categoria: "Economía", descripcion: "Medio especializado en finanzas" },
    { nombre: "Al Jazeera", url: "https://aljazeera.com", pais: "Qatar", categoria: "Internacional", descripcion: "Canal de noticias árabe" },
    { nombre: "France 24", url: "https://france24.com", pais: "Francia", categoria: "Internacional", descripcion: "Canal de noticias francés" },
    { nombre: "Deutsche Welle", url: "https://dw.com", pais: "Alemania", categoria: "Internacional", descripcion: "Medio internacional alemán" },
    { nombre: "NHK World", url: "https://nhk.or.jp/world", pais: "Japón", categoria: "Internacional", descripcion: "Medio público japonés" },
    { nombre: "The Times", url: "https://thetimes.co.uk", pais: "Reino Unido", categoria: "General", descripcion: "Diario británico histórico" },
    { nombre: "Washington Post", url: "https://washingtonpost.com", pais: "Estados Unidos", categoria: "General", descripcion: "Periódico estadounidense influyente" },
    { nombre: "USA Today", url: "https://usatoday.com", pais: "Estados Unidos", categoria: "General", descripcion: "Diario nacional estadounidense" },
    { nombre: "Los Angeles Times", url: "https://latimes.com", pais: "Estados Unidos", categoria: "General", descripcion: "Principal diario de California" },
    { nombre: "Chicago Tribune", url: "https://chicagotribune.com", pais: "Estados Unidos", categoria: "General", descripcion: "Periódico de Chicago" },
    { nombre: "El Mercurio", url: "https://elmercurio.com", pais: "Chile", categoria: "General", descripcion: "Diario chileno tradicional" },
    { nombre: "La Tercera", url: "https://latercera.com", pais: "Chile", categoria: "General", descripcion: "Periódico chileno de actualidad" },
    { nombre: "El Comercio", url: "https://elcomercio.pe", pais: "Perú", categoria: "General", descripcion: "Principal diario peruano" },
    { nombre: "La Vanguardia", url: "https://lavanguardia.com", pais: "España", categoria: "General", descripcion: "Diario catalán de referencia" },
    { nombre: "Público", url: "https://publico.es", pais: "España", categoria: "General", descripcion: "Periódico español progresista" },
    { nombre: "Expansión", url: "https://expansion.com", pais: "España", categoria: "Economía", descripcion: "Diario económico español" },
    { nombre: "Cinco Días", url: "https://cincodias.elpais.com", pais: "España", categoria: "Economía", descripcion: "Periódico económico español" },
    { nombre: "Sport", url: "https://sport.es", pais: "España", categoria: "Deportes", descripcion: "Diario deportivo catalán" },
    { nombre: "Marca", url: "https://marca.com", pais: "España", categoria: "Deportes", descripcion: "Principal diario deportivo español" },
    { nombre: "AS", url: "https://as.com", pais: "España", categoria: "Deportes", descripcion: "Diario deportivo español" },
    { nombre: "L'Équipe", url: "https://lequipe.fr", pais: "Francia", categoria: "Deportes", descripcion: "Diario deportivo francés" },
    { nombre: "Gazzetta dello Sport", url: "https://gazzetta.it", pais: "Italia", categoria: "Deportes", descripcion: "Diario deportivo italiano" },
    { nombre: "ESPN", url: "https://espn.com", pais: "Estados Unidos", categoria: "Deportes", descripcion: "Red de medios deportivos" },
    { nombre: "Sky News", url: "https://news.sky.com", pais: "Reino Unido", categoria: "Televisión", descripcion: "Canal de noticias británico" },
    { nombre: "Fox News", url: "https://foxnews.com", pais: "Estados Unidos", categoria: "Televisión", descripcion: "Canal de noticias conservador" },
    { nombre: "MSNBC", url: "https://msnbc.com", pais: "Estados Unidos", categoria: "Televisión", descripcion: "Canal de noticias progresista" },
    { nombre: "Politico", url: "https://politico.com", pais: "Estados Unidos", categoria: "Política", descripcion: "Medio especializado en política" },
    { nombre: "The Economist", url: "https://economist.com", pais: "Reino Unido", categoria: "Revista", descripcion: "Revista semanal de análisis" }
  ]);

  const [formData, setFormData] = useState({
    nombre: "",
    url: "",
    pais: "",
    categoria: "",
    descripcion: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.nombre && formData.url && formData.pais && formData.categoria && formData.descripcion) {
      setMediaSamples([...mediaSamples, formData]);
      setFormData({
        nombre: "",
        url: "",
        pais: "",
        categoria: "",
        descripcion: ""
      });
      setShowModal(false);
    }
  };

  return (
    <div className="media-container">
      <div className="media-header"> 
        <h1 className="media-title">Medios de Prensa</h1>
        <div className="media-actions">
          <button className="media-btn" onClick={() => setShowModal(true)}>
            Agregar Medio
          </button>
          <button className="media-btn">Borrar todo</button>
        </div>
      </div>
      <div className="media-table-container">
      <table className="media-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>URL</th>
              <th>País</th>
              <th>Categoría</th>
              <th>Descripción</th>
            </tr>
          </thead>
          <tbody>
            {mediaSamples.map((medio, idx) => (
              <tr key={idx}>
                <td>{medio.nombre}</td>
                <td>{medio.url}</td>
                <td>{medio.pais}</td>
                <td>{medio.categoria}</td>
                <td>{medio.descripcion}</td>
              </tr>
            ))}
          </tbody>
      </table>
      </div>
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form className="media-form" onSubmit={handleSubmit}>
              <input 
                type="text" 
                name="nombre"
                placeholder="Nombre medio" 
                value={formData.nombre}
                onChange={handleInputChange}
                required
              />
              <input 
                type="text" 
                name="url"
                placeholder="URL" 
                value={formData.url}
                onChange={handleInputChange}
                required
              />
              <input 
                type="text" 
                name="pais"
                placeholder="País" 
                value={formData.pais}
                onChange={handleInputChange}
                required
              />
              <input 
                type="text" 
                name="categoria"
                placeholder="Categoría" 
                value={formData.categoria}
                onChange={handleInputChange}
                required
              />
              <input 
                type="text" 
                name="descripcion"
                placeholder="Descripción" 
                value={formData.descripcion}
                onChange={handleInputChange}
                required
              />
              <button type="submit" className="media-btn">
                Guardar
              </button>
              <button type="button" className="close-btn" onClick={() => setShowModal(false)}>
                Cerrar
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MediaManagement;