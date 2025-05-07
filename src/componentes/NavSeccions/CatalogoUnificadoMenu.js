import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import './catalogoUnificadoMenu.css';
import { useTheme } from '../../context/ThemeSwitchContext';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import CategoryIcon from '@mui/icons-material/Category';
import CelebrationIcon from '@mui/icons-material/Celebration';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import CakeIcon from '@mui/icons-material/Cake';
import CardGiftcardIcon from '@mui/icons-material/CardGiftcard';
import FavoriteIcon from '@mui/icons-material/Favorite';
import CoffeeMakerIcon from '@mui/icons-material/CoffeeMaker';
import ChildFriendlyIcon from '@mui/icons-material/ChildFriendly';
import MoodIcon from '@mui/icons-material/Mood';
import SpaIcon from '@mui/icons-material/Spa';
import StyleIcon from '@mui/icons-material/Style';
import GradeIcon from '@mui/icons-material/Grade';
import WineBarIcon from '@mui/icons-material/WineBar';
import BreakfastDiningIcon from '@mui/icons-material/BreakfastDining';
import YardIcon from '@mui/icons-material/Yard';
import InventoryIcon from '@mui/icons-material/Inventory';
import FastfoodIcon from '@mui/icons-material/Fastfood';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import BlurCircularIcon from '@mui/icons-material/BlurCircular';
import ThumbUpIcon from '@mui/icons-material/ThumbUp';
import WorkIcon from '@mui/icons-material/Work';
import HealingIcon from '@mui/icons-material/Healing';
import ShoppingBagIcon from '@mui/icons-material/ShoppingBag';
import AutoAwesomeIcon from '@mui/icons-material/AutoAwesome';
import EventIcon from '@mui/icons-material/Event';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import EggIcon from '@mui/icons-material/Egg';
import NatureIcon from '@mui/icons-material/Nature';
import WomanIcon from '@mui/icons-material/Woman';
import ManIcon from '@mui/icons-material/Man';
import ChurchIcon from '@mui/icons-material/Church';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import RestaurantIcon from '@mui/icons-material/Restaurant';
import TodayIcon from '@mui/icons-material/Today';
import AccessibilityIcon from '@mui/icons-material/Accessibility';
import LightbulbIcon from '@mui/icons-material/Lightbulb';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import PetsIcon from '@mui/icons-material/Pets';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';

export const CatalogoUnificadoMenu = ({ onClose }) => {
    const { isDarkMode } = useTheme();
    const className = isDarkMode ? 'dark-mode' : '';
    const menuRef = useRef(null);
    const sectionRefs = useRef({
        categorias: useRef(null),
        ocasiones: useRef(null),
        fechas: useRef(null),
    });

    const [activeSection, setActiveSection] = useState(null);
    const [activeSubsection, setActiveSubsection] = useState(null);
    const [subMenuOrientation, setSubMenuOrientation] = useState('derecha');
    const [windowWidth, setWindowWidth] = useState(
        typeof window !== 'undefined' ? window.innerWidth : 960
    );

    // Actualizar el ancho de la ventana cuando cambia
    useEffect(() => {
        const handleResize = () => {
            setWindowWidth(window.innerWidth);
            checkSubMenuOrientation();
        };

        window.addEventListener('resize', handleResize);
        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    // Verificar la orientación del submenú cuando cambia la sección activa
    useEffect(() => {
        if (activeSection) {
            checkSubMenuOrientation();
        }
    }, [activeSection]);

    // Función para verificar si hay suficiente espacio a la derecha
    const checkSubMenuOrientation = () => {
        if (!activeSection || !sectionRefs.current[activeSection]?.current) return;
        
        const sectionRect = sectionRefs.current[activeSection].current.getBoundingClientRect();
        const windowWidth = window.innerWidth;
        const necesarioALaDerecha = sectionRect.right + 520; // 520px es el ancho del submenú
        
        if (necesarioALaDerecha > windowWidth - 20) { // 20px de margen
            setSubMenuOrientation('izquierda');
        } else {
            setSubMenuOrientation('derecha');
        }
    };

    // Cerrar el menú al hacer clic fuera
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onClose && onClose();
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [onClose]);

    // Cerrar el menú con ESC
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                onClose && onClose();
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [onClose]);

    // Datos de categorías y subcategorías
    const categorias = {
        titulo: 'Productos',
        icono: <CategoryIcon />,
        href: '/productos',
        grupos: [
            {
                titulo: 'Arreglos Florales',
                icono: <LocalFloristIcon fontSize="small" />,
                items: [
                    { nombre: 'Rosas', icono: <SpaIcon fontSize="small" />, href: '/categoria/rosas' },
                    { nombre: 'Girasoles', icono: <SpaIcon fontSize="small" />, href: '/categoria/girasoles' },
                    { nombre: 'Liliums', icono: <SpaIcon fontSize="small" />, href: '/categoria/liliums' },
                    { nombre: 'Gerberas', icono: <SpaIcon fontSize="small" />, href: '/categoria/gerberas' },
                    { nombre: 'Tulipanes', icono: <SpaIcon fontSize="small" />, href: '/categoria/tulipanes' },
                ]
            },
            {
                titulo: 'Regalos Gourmet',
                icono: <RestaurantIcon fontSize="small" />,
                items: [
                    { nombre: 'Chocolates', icono: <FastfoodIcon fontSize="small" />, href: '/categoria/chocolates' },
                    { nombre: 'Vinos', icono: <WineBarIcon fontSize="small" />, href: '/categoria/vinos' },
                    { nombre: 'Champagnes', icono: <WineBarIcon fontSize="small" />, href: '/categoria/champagnes' },
                    { nombre: 'Desayunos', icono: <BreakfastDiningIcon fontSize="small" />, href: '/categoria/desayunos' },
                ]
            },
            {
                titulo: 'Presentaciones',
                icono: <StyleIcon fontSize="small" />,
                items: [
                    { nombre: 'Cajas', icono: <InventoryIcon fontSize="small" />, href: '/categoria/cajas' },
                    { nombre: 'Canastas', icono: <ShoppingBagIcon fontSize="small" />, href: '/categoria/canastas' },
                    { nombre: 'Combos', icono: <ShoppingBagIcon fontSize="small" />, href: '/categoria/combos' },
                    { nombre: 'Ramos', icono: <LocalFloristIcon fontSize="small" />, href: '/categoria/ramos' },
                ]
            },
            {
                titulo: 'Productos Especiales',
                icono: <AutoAwesomeIcon fontSize="small" />,
                items: [
                    { nombre: 'Bonsai', icono: <YardIcon fontSize="small" />, href: '/categoria/bonsai' },
                    { nombre: 'Coronas', icono: <BlurCircularIcon fontSize="small" />, href: '/categoria/coronas' },
                    { nombre: 'Peluches', icono: <PetsIcon fontSize="small" />, href: '/categoria/peluches' },
                    { nombre: 'Plantas', icono: <NatureIcon fontSize="small" />, href: '/categoria/plantas' },
                ]
            }
        ]
    };

    // Datos de ocasiones y subocasiones
    const ocasiones = {
        titulo: 'Ocasiones',
        icono: <CelebrationIcon />,
        href: '/ocasiones',
        grupos: [
            {
                titulo: 'Celebraciones',
                icono: <CakeIcon fontSize="small" />,
                items: [
                    { nombre: 'Cumpleaños', icono: <CakeIcon fontSize="small" />, href: '/ocasiones/cumpleaños' },
                    { nombre: 'Aniversarios', icono: <FavoriteIcon fontSize="small" />, href: '/ocasiones/aniversarios' },
                    { nombre: 'Graduaciones', icono: <MenuBookIcon fontSize="small" />, href: '/ocasiones/graduaciones' },
                    { nombre: 'Bodas', icono: <CelebrationIcon fontSize="small" />, href: '/ocasiones/bodas' },
                ]
            },
            {
                titulo: 'Sentimientos',
                icono: <FavoriteIcon fontSize="small" />,
                items: [
                    { nombre: 'Amor', icono: <FavoriteIcon fontSize="small" />, href: '/ocasiones/amor' },
                    { nombre: 'Agradecimiento', icono: <ThumbUpIcon fontSize="small" />, href: '/ocasiones/agradecimiento' },
                    { nombre: 'Amistad', icono: <AccessibilityIcon fontSize="small" />, href: '/ocasiones/amistad' },
                    { nombre: 'Disculpas', icono: <MoodIcon fontSize="small" />, href: '/ocasiones/disculpas' },
                ]
            },
            {
                titulo: 'Momentos Especiales',
                icono: <LightbulbIcon fontSize="small" />,
                items: [
                    { nombre: 'Nacimientos', icono: <ChildFriendlyIcon fontSize="small" />, href: '/ocasiones/nacimientos' },
                    { nombre: 'Recuperación', icono: <HealingIcon fontSize="small" />, href: '/ocasiones/recuperacion' },
                    { nombre: 'Condolencias', icono: <MoodIcon fontSize="small" />, href: '/ocasiones/condolencias' },
                    { nombre: 'Funerales', icono: <ChurchIcon fontSize="small" />, href: '/ocasiones/funerales' },
                ]
            },
            {
                titulo: 'Para Quién',
                icono: <AccessibilityIcon fontSize="small" />,
                items: [
                    { nombre: 'Para Ella', icono: <WomanIcon fontSize="small" />, href: '/ocasiones/ella' },
                    { nombre: 'Para Él', icono: <ManIcon fontSize="small" />, href: '/ocasiones/el' },
                    { nombre: 'Para Niños', icono: <ChildFriendlyIcon fontSize="small" />, href: '/ocasiones/niños' },
                    { nombre: 'Corporativo', icono: <WorkIcon fontSize="small" />, href: '/ocasiones/corporativo' },
                ]
            }
        ]
    };

    // Datos de fechas especiales y subfechas
    const fechasEspeciales = {
        titulo: 'Fechas Especiales',
        icono: <EventIcon />,
        href: '/fechas-especiales',
        grupos: [
            {
                titulo: 'Fechas Comerciales',
                icono: <ShoppingBagIcon fontSize="small" />,
                items: [
                    { nombre: 'San Valentín', icono: <FavoriteIcon fontSize="small" />, href: '/fechas-especiales/san-valentin' },
                    { nombre: 'Día de la Madre', icono: <WomanIcon fontSize="small" />, href: '/fechas-especiales/dia-madre' },
                    { nombre: 'Día del Padre', icono: <ManIcon fontSize="small" />, href: '/fechas-especiales/dia-padre' },
                    { nombre: 'Navidad', icono: <EmojiEventsIcon fontSize="small" />, href: '/fechas-especiales/navidad' },
                ]
            },
            {
                titulo: 'Celebraciones Estacionales',
                icono: <TodayIcon fontSize="small" />,
                items: [
                    { nombre: 'Primavera', icono: <NatureIcon fontSize="small" />, href: '/fechas-especiales/primavera' },
                    { nombre: 'Verano', icono: <DirectionsRunIcon fontSize="small" />, href: '/fechas-especiales/verano' },
                    { nombre: 'Año Nuevo', icono: <CelebrationIcon fontSize="small" />, href: '/fechas-especiales/año-nuevo' },
                    { nombre: 'Pascua', icono: <EggIcon fontSize="small" />, href: '/fechas-especiales/pascua' },
                ]
            },
            {
                titulo: 'Celebraciones Profesionales',
                icono: <WorkIcon fontSize="small" />,
                items: [
                    { nombre: 'Día del Maestro', icono: <MenuBookIcon fontSize="small" />, href: '/fechas-especiales/dia-maestro' },
                    { nombre: 'Día de la Secretaria', icono: <WorkIcon fontSize="small" />, href: '/fechas-especiales/dia-secretaria' },
                    { nombre: 'Día del Médico', icono: <HealingIcon fontSize="small" />, href: '/fechas-especiales/dia-medico' },
                    { nombre: 'Día del Abogado', icono: <MenuBookIcon fontSize="small" />, href: '/fechas-especiales/dia-abogado' },
                ]
            }
        ]
    };



    // Funciones para manejar la interacción con el menú
    const handleSectionHover = (section) => {
        setActiveSection(section);
        setActiveSubsection(null);
    };

    const handleSubsectionHover = (subsection) => {
        setActiveSubsection(subsection);
    };

    const handleMenuLeave = () => {
        if (windowWidth >= 960) {
            setActiveSection(null);
            setActiveSubsection(null);
        }
    };

    // Renderizado condicional basado en el ancho de la ventana
    const isMobile = windowWidth < 960;

    // Componente para renderizar un grupo (nivel 3)
    const renderGrupo = (grupo, index) => (
        <div key={index} className="catalogo-grupo">
            <div 
                className="catalogo-grupo-titulo"
                onClick={() => isMobile ? handleSubsectionHover(activeSubsection === index ? null : index) : null}
                onMouseEnter={() => !isMobile ? handleSubsectionHover(index) : null}
                onMouseLeave={() => !isMobile ? handleSubsectionHover(null) : null}
            >
                {grupo.icono}
                <h4>{grupo.titulo}</h4>
                {isMobile && (
                    <KeyboardArrowDownIcon 
                        style={{ 
                            marginLeft: 'auto', 
                            transform: activeSubsection === index ? 'rotate(180deg)' : 'rotate(0deg)',
                            transition: 'transform 0.3s ease'
                            
                        }} 
                    />
                )}
            </div>
            {(activeSubsection === index || !isMobile) && (
                <div className="catalogo-subgrid">
                    {grupo.items.map((item, idx) => (
                        <Link 
                            key={idx} 
                            href={item.href} 
                            className="catalogo-item"
                            onClick={onClose}
                        >
                            <div className="catalogo-item-icono">
                                {item.icono}
                            </div>
                            <p>{item.nombre}</p>
                        </Link>
                    ))}
                </div>
            )}
        </div>
    );

    // Componente para renderizar una sección (nivel 2)
    const renderSeccion = (seccion, isActive, refKey) => (
        <>
            <div className="catalogo-seccion-titulo" ref={sectionRefs.current[refKey]}>
                {seccion.icono}
                <span>{seccion.titulo}</span>
                <KeyboardArrowRightIcon 
                    className={`flecha-derecha ${isActive ? 'rotada' : ''}`} 
                />
            </div>
            
            {isActive && (
                <div className={`catalogo-subseccion ${subMenuOrientation === 'izquierda' ? 'orientacion-izquierda' : ''}`}>
                    <h3 className="subseccion-titulo">{seccion.titulo}</h3>
                    {seccion.grupos.map((grupo, idx) => renderGrupo(grupo, idx))}
                    <div className="catalogo-todos">
                        <Link href={seccion.href} className="ver-todos" onClick={onClose}>
                            Ver todo en {seccion.titulo}
                        </Link>
                    </div>
                </div>
            )}
        </>
    );

    return (
        <div className={`catalogo-menu ${className}`} ref={menuRef} onMouseLeave={handleMenuLeave}>
            <div className="catalogo-columnas">
                <div 
                    className={`catalogo-seccion ${activeSection === 'categorias' ? 'active' : ''}`}
                    onMouseEnter={() => handleSectionHover('categorias')}
                    onMouseLeave={() => handleSectionHover(null)}
                    onClick={() => isMobile ? handleSectionHover(activeSection === 'categorias' ? null : 'categorias') : null}
                    role="menuitem"
                    tabIndex={0}
                    aria-expanded={activeSection === 'categorias'}
                >
                    {renderSeccion(categorias, activeSection === 'categorias', 'categorias')}
                </div>

                <div 
                    className={`catalogo-seccion ${activeSection === 'ocasiones' ? 'active' : ''}`}
                    onMouseEnter={() => handleSectionHover('ocasiones')}
                    onMouseLeave={() => handleSectionHover(null)}
                    onClick={() => isMobile ? handleSectionHover(activeSection === 'ocasiones' ? null : 'ocasiones') : null}
                    role="menuitem"
                    tabIndex={0}
                    aria-expanded={activeSection === 'ocasiones'}
                >
                    {renderSeccion(ocasiones, activeSection === 'ocasiones', 'ocasiones')}
                </div>

                <div 
                    className={`catalogo-seccion ${activeSection === 'fechas' ? 'active' : ''}`}
                    onMouseEnter={() => handleSectionHover('fechas')}
                    onMouseLeave={() => handleSectionHover(null)}
                    onClick={() => isMobile ? handleSectionHover(activeSection === 'fechas' ? null : 'fechas') : null}
                    role="menuitem"
                    tabIndex={0}
                    aria-expanded={activeSection === 'fechas'}
                >
                    {renderSeccion(fechasEspeciales, activeSection === 'fechas', 'fechas')}
                </div>

        
            </div>

            <div className="catalogo-footer">
                <Link href="/productos/destacados" className="catalogo-destacado" onClick={onClose}>
                    <GradeIcon />
                    <span>Productos Destacados</span>
                </Link>
                <Link href="/productos/nuevos" className="catalogo-destacado" onClick={onClose}>
                    <AutoAwesomeIcon />
                    <span>Nuevos Productos</span>
                </Link>
                <Link href="/productos/ofertas" className="catalogo-destacado" onClick={onClose}>
                    <AttachMoneyIcon />
                    <span>Ofertas Especiales</span>
                </Link>
            </div>
        </div>
    );
};

export default CatalogoUnificadoMenu;