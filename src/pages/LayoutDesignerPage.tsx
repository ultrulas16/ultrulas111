import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Circle, Text, Group, Line } from 'react-konva';
import { 
  Save, 
  Download, 
  Trash2, 
  Plus, 
  Minus, 
  RotateCcw, 
  RotateCw, 
  Copy, 
  Layers, 
  Grid, 
  FileText, 
  Building, 
  X, 
  Image as ImageIcon,
  Type,
  Square,
  DoorOpen
} from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

// Ekipman türleri
const equipmentTypes = [
  { id: 'rodent_bait', name: 'Kemirgen Yem İstasyonu', color: '#e74c3c' },
  { id: 'insect_monitor', name: 'Böcek Monitörü', color: '#3498db' },
  { id: 'fly_trap', name: 'Sinek Tuzağı', color: '#2ecc71' },
  { id: 'uv_trap', name: 'UV Tuzak', color: '#9b59b6' },
  { id: 'glue_board', name: 'Yapışkan Tuzak', color: '#f1c40f' }
];

// Kapı türleri
const doorTypes = [
  { id: 'single_door', name: 'Tek Kapı', width: 40, height: 5 },
  { id: 'double_door', name: 'Çift Kapı', width: 60, height: 5 },
  { id: 'sliding_door', name: 'Sürgülü Kapı', width: 50, height: 5 }
];

// Dosya adını URL-safe hale getiren yardımcı fonksiyon
const sanitizeFileName = (name: string): string => {
  return name
    // Türkçe karakterleri ASCII karşılıklarıyla değiştir
    .replace(/ğ/g, 'g')
    .replace(/Ğ/g, 'G')
    .replace(/ü/g, 'u')
    .replace(/Ü/g, 'U')
    .replace(/ş/g, 's')
    .replace(/Ş/g, 'S')
    .replace(/ı/g, 'i')
    .replace(/İ/g, 'I')
    .replace(/ö/g, 'o')
    .replace(/Ö/g, 'O')
    .replace(/ç/g, 'c')
    .replace(/Ç/g, 'C')
    // Diğer özel karakterleri kaldır veya değiştir
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    // Birden fazla alt çizgiyi tek alt çizgiye dönüştür
    .replace(/_+/g, '_')
    // Başında ve sonunda alt çizgi varsa kaldır
    .replace(/^_+|_+$/g, '');
};

// Ekipman bileşeni
interface EquipmentProps {
  id: string;
  x: number;
  y: number;
  type: string;
  rotation: number;
  label: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
}

const Equipment: React.FC<EquipmentProps> = ({ 
  id, 
  x, 
  y, 
  type, 
  rotation, 
  label, 
  isSelected, 
  onSelect, 
  onChange 
}) => {
  const equipmentType = equipmentTypes.find(e => e.id === type) || equipmentTypes[0];
  const shapeRef = useRef<any>(null);
  const groupRef = useRef<any>(null);
  const textRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && shapeRef.current) {
      // Seçili ekipmanı vurgula
      shapeRef.current.to({
        duration: 0.2,
        shadowBlur: 10,
        shadowColor: 'black',
      });
    } else if (shapeRef.current) {
      // Vurgulamayı kaldır
      shapeRef.current.to({
        duration: 0.2,
        shadowBlur: 0,
      });
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      rotation={rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
    >
      <Circle
        ref={shapeRef}
        radius={20}
        fill={equipmentType.color}
        stroke={isSelected ? 'black' : 'transparent'}
        strokeWidth={isSelected ? 2 : 0}
      />
      <Text
        ref={textRef}
        text={label}
        fontSize={12}
        fill="white"
        width={40}
        height={40}
        offsetX={20}
        offsetY={20}
        align="center"
        verticalAlign="middle"
      />
      {/* Ekipman açıklaması - ekipmanın altında gösterilir */}
      <Text
        text={equipmentType.name}
        fontSize={10}
        fill="#333"
        width={120}
        offsetX={60}
        offsetY={-30}
        y={50}
        align="center"
      />
    </Group>
  );
};

// Duvar bileşeni
interface WallProps {
  id: string;
  points: number[];
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
}

const Wall: React.FC<WallProps> = ({
  id,
  points,
  isSelected,
  onSelect,
  onChange
}) => {
  const lineRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && lineRef.current) {
      lineRef.current.to({
        duration: 0.2,
        shadowBlur: 10,
        shadowColor: 'black',
      });
    } else if (lineRef.current) {
      lineRef.current.to({
        duration: 0.2,
        shadowBlur: 0,
      });
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    const node = e.target;
    const newPoints = [...points];
    
    // Duvarın tüm noktalarını taşı
    for (let i = 0; i < newPoints.length; i += 2) {
      newPoints[i] += node.x();
      newPoints[i + 1] += node.y();
    }
    
    onChange({
      points: newPoints,
    });
    
    // Pozisyonu sıfırla (noktalar zaten güncellendi)
    node.position({ x: 0, y: 0 });
  };

  return (
    <Line
      ref={lineRef}
      points={points}
      stroke="#333"
      strokeWidth={6}
      lineCap="round"
      lineJoin="round"
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      hitStrokeWidth={20}
      perfectDrawEnabled={false}
      shadowEnabled={false}
      shadowForStrokeEnabled={false}
      strokeScaleEnabled={false}
      stroke={isSelected ? '#000' : '#333'}
      strokeWidth={isSelected ? 8 : 6}
    />
  );
};

// Kapı bileşeni
interface DoorProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  rotation: number;
  type: string;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
}

const Door: React.FC<DoorProps> = ({
  id,
  x,
  y,
  width,
  height,
  rotation,
  type,
  isSelected,
  onSelect,
  onChange
}) => {
  const doorRef = useRef<any>(null);
  const groupRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && doorRef.current) {
      doorRef.current.to({
        duration: 0.2,
        shadowBlur: 10,
        shadowColor: 'black',
      });
    } else if (doorRef.current) {
      doorRef.current.to({
        duration: 0.2,
        shadowBlur: 0,
      });
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  // Kapı tipine göre çizim
  const renderDoor = () => {
    if (type === 'single_door') {
      return (
        <Group>
          <Rect
            width={width}
            height={height}
            fill="#8B4513" // Kahverengi
            cornerRadius={1}
          />
          <Line
            points={[0, 0, width * 0.8, height * 5]}
            stroke="#555"
            strokeWidth={1}
            dash={[2, 2]}
          />
        </Group>
      );
    } else if (type === 'double_door') {
      return (
        <Group>
          <Rect
            width={width}
            height={height}
            fill="#8B4513"
            cornerRadius={1}
          />
          <Line
            points={[width/2, 0, width/2, height * 5]}
            stroke="#555"
            strokeWidth={1}
          />
          <Line
            points={[0, 0, width * 0.4, height * 5]}
            stroke="#555"
            strokeWidth={1}
            dash={[2, 2]}
          />
          <Line
            points={[width, 0, width * 0.6, height * 5]}
            stroke="#555"
            strokeWidth={1}
            dash={[2, 2]}
          />
        </Group>
      );
    } else { // sliding_door
      return (
        <Group>
          <Rect
            width={width}
            height={height}
            fill="#8B4513"
            cornerRadius={1}
          />
          <Line
            points={[0, height + 2, width, height + 2]}
            stroke="#555"
            strokeWidth={1}
          />
          <Line
            points={[width * 0.2, 0, width * 0.2, height]}
            stroke="#555"
            strokeWidth={1}
            dash={[2, 2]}
          />
        </Group>
      );
    }
  };

  return (
    <Group
      ref={groupRef}
      x={x}
      y={y}
      rotation={rotation}
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
    >
      <Group ref={doorRef}>
        {renderDoor()}
      </Group>
      <Text
        text="Kapı"
        fontSize={10}
        fill="#333"
        width={60}
        offsetX={30}
        offsetY={-15}
        y={20}
        align="center"
      />
    </Group>
  );
};

// Metin bileşeni
interface TextItemProps {
  id: string;
  x: number;
  y: number;
  text: string;
  fontSize: number;
  isSelected: boolean;
  onSelect: () => void;
  onChange: (newAttrs: any) => void;
}

const TextItem: React.FC<TextItemProps> = ({
  id,
  x,
  y,
  text,
  fontSize,
  isSelected,
  onSelect,
  onChange
}) => {
  const textRef = useRef<any>(null);

  useEffect(() => {
    if (isSelected && textRef.current) {
      textRef.current.to({
        duration: 0.2,
        shadowBlur: 10,
        shadowColor: 'black',
      });
    } else if (textRef.current) {
      textRef.current.to({
        duration: 0.2,
        shadowBlur: 0,
      });
    }
  }, [isSelected]);

  const handleDragEnd = (e: any) => {
    onChange({
      x: e.target.x(),
      y: e.target.y(),
    });
  };

  return (
    <Text
      ref={textRef}
      x={x}
      y={y}
      text={text}
      fontSize={fontSize}
      fill="#000"
      draggable
      onClick={onSelect}
      onTap={onSelect}
      onDragEnd={handleDragEnd}
      padding={5}
      stroke={isSelected ? '#ddd' : 'transparent'}
      strokeWidth={isSelected ? 1 : 0}
      shadowEnabled={false}
    />
  );
};

// Ana bileşen
const LayoutDesignerPage: React.FC = () => {
  const { user } = useAuth();
  const [layouts, setLayouts] = useState<any[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<'equipment' | 'wall' | 'door' | 'text' | null>(null);
  const [equipments, setEquipments] = useState<any[]>([]);
  const [walls, setWalls] = useState<any[]>([]);
  const [doors, setDoors] = useState<any[]>([]);
  const [texts, setTexts] = useState<any[]>([]);
  const [stageSize, setStageSize] = useState({ width: 800, height: 600 });
  const [scale, setScale] = useState(1);
  const [showGrid, setShowGrid] = useState(true);
  const [gridSize, setGridSize] = useState(20);
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [showTextModal, setShowTextModal] = useState(false);
  const [layoutName, setLayoutName] = useState('');
  const [clientCompany, setClientCompany] = useState('');
  const [clientAddress, setClientAddress] = useState('');
  const [currentLayoutId, setCurrentLayoutId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isDrawingWall, setIsDrawingWall] = useState(false);
  const [currentWallPoints, setCurrentWallPoints] = useState<number[]>([]);
  const [newTextValue, setNewTextValue] = useState('');
  const [newTextSize, setNewTextSize] = useState(16);
  const [logoUrl, setLogoUrl] = useState('');
  
  const stageRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Sayfa yüklendiğinde kaydedilmiş krokiler yüklenir
  useEffect(() => {
    if (user) {
      fetchLayouts();
    }
  }, [user]);

  // Konteyner boyutu değiştiğinde sahne boyutu güncellenir
  useEffect(() => {
    const updateSize = () => {
      if (containerRef.current) {
        const width = containerRef.current.offsetWidth;
        const height = Math.max(600, window.innerHeight - 300);
        setStageSize({ width, height });
      }
    };

    updateSize();
    window.addEventListener('resize', updateSize);
    return () => window.removeEventListener('resize', updateSize);
  }, []);

  // Kaydedilmiş krokileri getir
  const fetchLayouts = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('equipment_layouts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setLayouts(data || []);
    } catch (error: any) {
      console.error('Error fetching layouts:', error.message);
      setError('Krokiler yüklenirken bir hata oluştu.');
    } finally {
      setLoading(false);
    }
  };

  // Yeni ekipman ekle
  const addEquipment = (type: string) => {
    const newEquipment = {
      id: uuidv4(),
      x: stageSize.width / 2 - 20,
      y: stageSize.height / 2 - 20,
      type,
      rotation: 0,
      label: `${equipments.length + 1}`,
    };
    setEquipments([...equipments, newEquipment]);
    setSelectedId(newEquipment.id);
    setSelectedType('equipment');
  };

  // Yeni kapı ekle
  const addDoor = (type: string) => {
    const doorType = doorTypes.find(d => d.id === type) || doorTypes[0];
    const newDoor = {
      id: uuidv4(),
      x: stageSize.width / 2 - doorType.width / 2,
      y: stageSize.height / 2 - doorType.height / 2,
      width: doorType.width,
      height: doorType.height,
      type,
      rotation: 0,
    };
    setDoors([...doors, newDoor]);
    setSelectedId(newDoor.id);
    setSelectedType('door');
  };

  // Ekipman güncelle
  const updateEquipment = (id: string, newAttrs: any) => {
    setEquipments(
      equipments.map(equip => (equip.id === id ? { ...equip, ...newAttrs } : equip))
    );
  };

  // Duvar güncelle
  const updateWall = (id: string, newAttrs: any) => {
    setWalls(
      walls.map(wall => (wall.id === id ? { ...wall, ...newAttrs } : wall))
    );
  };

  // Kapı güncelle
  const updateDoor = (id: string, newAttrs: any) => {
    setDoors(
      doors.map(door => (door.id === id ? { ...door, ...newAttrs } : door))
    );
  };

  // Metin güncelle
  const updateText = (id: string, newAttrs: any) => {
    setTexts(
      texts.map(text => (text.id === id ? { ...text, ...newAttrs } : text))
    );
  };

  // Seçili öğeyi döndür
  const rotateSelected = (direction: 'cw' | 'ccw') => {
    if (!selectedId || !selectedType) return;
    
    const rotationChange = direction === 'cw' ? 15 : -15;
    
    if (selectedType === 'equipment') {
      const equipment = equipments.find(e => e.id === selectedId);
      if (!equipment) return;
      updateEquipment(selectedId, { rotation: equipment.rotation + rotationChange });
    } else if (selectedType === 'door') {
      const door = doors.find(d => d.id === selectedId);
      if (!door) return;
      updateDoor(selectedId, { rotation: door.rotation + rotationChange });
    }
  };

  // Seçili öğeyi sil
  const deleteSelected = () => {
    if (!selectedId || !selectedType) return;
    
    if (selectedType === 'equipment') {
      setEquipments(equipments.filter(e => e.id !== selectedId));
    } else if (selectedType === 'wall') {
      setWalls(walls.filter(w => w.id !== selectedId));
    } else if (selectedType === 'door') {
      setDoors(doors.filter(d => d.id !== selectedId));
    } else if (selectedType === 'text') {
      setTexts(texts.filter(t => t.id !== selectedId));
    }
    
    setSelectedId(null);
    setSelectedType(null);
  };

  // Seçili öğeyi kopyala
  const duplicateSelected = () => {
    if (!selectedId || !selectedType) return;
    
    if (selectedType === 'equipment') {
      const equipment = equipments.find(e => e.id === selectedId);
      if (!equipment) return;

      const newEquipment = {
        ...equipment,
        id: uuidv4(),
        x: equipment.x + 20,
        y: equipment.y + 20,
      };
      setEquipments([...equipments, newEquipment]);
      setSelectedId(newEquipment.id);
    } else if (selectedType === 'door') {
      const door = doors.find(d => d.id === selectedId);
      if (!door) return;

      const newDoor = {
        ...door,
        id: uuidv4(),
        x: door.x + 20,
        y: door.y + 20,
      };
      setDoors([...doors, newDoor]);
      setSelectedId(newDoor.id);
    } else if (selectedType === 'text') {
      const textItem = texts.find(t => t.id === selectedId);
      if (!textItem) return;

      const newText = {
        ...textItem,
        id: uuidv4(),
        x: textItem.x + 20,
        y: textItem.y + 20,
      };
      setTexts([...texts, newText]);
      setSelectedId(newText.id);
    }
  };

  // Yakınlaştır/Uzaklaştır
  const handleZoom = (direction: 'in' | 'out') => {
    const newScale = direction === 'in' ? scale * 1.1 : scale / 1.1;
    setScale(Math.min(Math.max(0.5, newScale), 2));
  };

  // Duvar çizmeyi başlat
  const startDrawingWall = () => {
    setIsDrawingWall(true);
    setCurrentWallPoints([]);
    setSelectedId(null);
    setSelectedType(null);
  };

  // Duvar çizmeyi bitir
  const finishDrawingWall = () => {
    if (currentWallPoints.length >= 4) {
      const newWall = {
        id: uuidv4(),
        points: currentWallPoints,
      };
      setWalls([...walls, newWall]);
    }
    setIsDrawingWall(false);
    setCurrentWallPoints([]);
  };

  // Metin ekle
  const addText = () => {
    if (!newTextValue.trim()) return;
    
    const newText = {
      id: uuidv4(),
      x: stageSize.width / 2 - 50,
      y: stageSize.height / 2 - 10,
      text: newTextValue,
      fontSize: newTextSize,
    };
    
    setTexts([...texts, newText]);
    setSelectedId(newText.id);
    setSelectedType('text');
    setShowTextModal(false);
    setNewTextValue('');
  };

  // Kroki kaydet
  const saveLayout = async () => {
    if (!layoutName || !clientCompany) {
      setError('Kroki adı ve müşteri firma adı zorunludur.');
      return;
    }

    try {
      setSaving(true);
      setError(null);

      // Kroki görselini oluştur
      const stage = stageRef.current;
      if (!stage) return;

      // Sahneyi görüntüye dönüştür
      const dataURL = stage.toDataURL({ 
        pixelRatio: 2,
        mimeType: 'image/jpeg',
        quality: 0.9, // JPEG kalitesi (0-1 arası)
        backgroundColor: 'white' // Beyaz arka plan
      });
      
      // Base64 veriyi Blob'a dönüştür
      const blob = await (await fetch(dataURL)).blob();
      
      // Dosya adı oluştur - JPEG uzantılı ve URL-safe
      const sanitizedName = sanitizeFileName(layoutName);
      const fileName = `${sanitizedName}_${Date.now()}.jpeg`;
      
      // Görüntüyü Supabase Storage'a yükle
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('layouts')
        .upload(fileName, blob);

      if (uploadError) throw uploadError;

      // Yüklenen görüntünün URL'sini al
      const { data: urlData } = supabase.storage
        .from('layouts')
        .getPublicUrl(fileName);

      const imageUrl = urlData.publicUrl;

      // Kroki verilerini hazırla
      const layoutData = {
        name: layoutName,
        client_company_name: clientCompany,
        client_address: clientAddress,
        layout_json: { equipments, walls, doors, texts, stageSize, scale, logoUrl },
        exported_image_url: imageUrl,
      };

      // Yeni kroki oluştur veya mevcut kroki güncelle
      let response;
      if (currentLayoutId) {
        response = await supabase
          .from('equipment_layouts')
          .update(layoutData)
          .eq('id', currentLayoutId);
      } else {
        response = await supabase
          .from('equipment_layouts')
          .insert([layoutData]);
      }

      if (response.error) throw response.error;

      setSuccess('Kroki başarıyla kaydedildi.');
      setShowSaveModal(false);
      fetchLayouts();
    } catch (error: any) {
      console.error('Error saving layout:', error.message);
      setError('Kroki kaydedilirken bir hata oluştu.');
    } finally {
      setSaving(false);
    }
  };

  // Kroki yükle
  const loadLayout = (layout: any) => {
    try {
      setEquipments(layout.layout_json.equipments || []);
      setWalls(layout.layout_json.walls || []);
      setDoors(layout.layout_json.doors || []);
      setTexts(layout.layout_json.texts || []);
      setStageSize(layout.layout_json.stageSize || { width: 800, height: 600 });
      setScale(layout.layout_json.scale || 1);
      setLayoutName(layout.name);
      setClientCompany(layout.client_company_name);
      setClientAddress(layout.client_address || '');
      setLogoUrl(layout.layout_json.logoUrl || '');
      setCurrentLayoutId(layout.id);
      setShowLoadModal(false);
      setSuccess('Kroki başarıyla yüklendi.');
    } catch (error: any) {
      console.error('Error loading layout:', error.message);
      setError('Kroki yüklenirken bir hata oluştu.');
    }
  };

  // Kroki dışa aktar
  const exportLayout = async () => {
    try {
      const stage = stageRef.current;
      if (!stage) return;

      // Sahneyi JPEG olarak görüntüye dönüştür - beyaz arka plan ekle
      const dataURL = stage.toDataURL({ 
        pixelRatio: 2,
        mimeType: 'image/jpeg',
        quality: 0.9, // JPEG kalitesi (0-1 arası)
        backgroundColor: 'white' // Beyaz arka plan
      });
      
      // Görüntüyü indir - dosya adını sanitize et
      const sanitizedName = sanitizeFileName(layoutName || 'ekipman_krokisi');
      const link = document.createElement('a');
      link.download = `${sanitizedName}_${Date.now()}.jpeg`;
      link.href = dataURL;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error: any) {
      console.error('Error exporting layout:', error.message);
      setError('Kroki dışa aktarılırken bir hata oluştu.');
    }
  };

  // Yeni kroki
  const newLayout = () => {
    if (window.confirm('Yeni bir kroki oluşturmak istediğinizden emin misiniz? Kaydedilmemiş değişiklikler kaybolacaktır.')) {
      setEquipments([]);
      setWalls([]);
      setDoors([]);
      setTexts([]);
      setLayoutName('');
      setClientCompany('');
      setClientAddress('');
      setLogoUrl('');
      setCurrentLayoutId(null);
      setScale(1);
    }
  };

  // Izgara çizgileri oluştur
  const renderGrid = () => {
    if (!showGrid) return null;

    const gridLines = [];
    const { width, height } = stageSize;

    // Yatay çizgiler
    for (let i = 0; i <= height; i += gridSize) {
      gridLines.push(
        <Line
          key={`h-${i}`}
          points={[0, i, width, i]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }

    // Dikey çizgiler
    for (let i = 0; i <= width; i += gridSize) {
      gridLines.push(
        <Line
          key={`v-${i}`}
          points={[i, 0, i, height]}
          stroke="#ddd"
          strokeWidth={0.5}
        />
      );
    }

    return gridLines;
  };

  // Başlık ve müşteri bilgilerini render et
  const renderHeader = () => {
    const headerItems = [];
    const padding = 20;
    
    // Logo (eğer varsa)
    if (logoUrl) {
      // Logo için bir placeholder göster
      headerItems.push(
        <Rect
          key="logo-placeholder"
          x={padding}
          y={padding}
          width={100}
          height={50}
          fill="#f0f0f0"
          stroke="#ddd"
          cornerRadius={5}
        />
      );
      
      headerItems.push(
        <Text
          key="logo-text"
          x={padding + 50}
          y={padding + 25}
          text="LOGO"
          fontSize={14}
          fill="#999"
          width={100}
          align="center"
          verticalAlign="middle"
          offsetX={50}
          offsetY={25}
        />
      );
    }
    
    // Başlık
    headerItems.push(
      <Text
        key="title"
        x={stageSize.width / 2}
        y={padding}
        text="ZARARLI MÜCADELE EKİPMAN KROKISI"
        fontSize={20}
        fontStyle="bold"
        fill="#333"
        width={400}
        align="center"
        offsetX={200}
      />
    );
    
    // Müşteri bilgileri
    if (clientCompany) {
      headerItems.push(
        <Text
          key="client-info"
          x={stageSize.width - padding}
          y={padding}
          text={`Müşteri: ${clientCompany}\n${clientAddress ? `Adres: ${clientAddress}` : ''}`}
          fontSize={12}
          fill="#333"
          width={300}
          align="right"
          offsetX={300}
        />
      );
    }
    
    // Tarih
    headerItems.push(
      <Text
        key="date"
        x={stageSize.width - padding}
        y={padding + 40}
        text={`Tarih: ${new Date().toLocaleDateString('tr-TR')}`}
        fontSize={12}
        fill="#333"
        width={300}
        align="right"
        offsetX={300}
      />
    );
    
    return headerItems;
  };

  // Ekipman açıklamalarını render et
  const renderLegend = () => {
    const legendItems = [];
    const padding = 20;
    const startY = stageSize.height - 120;
    
    // Başlık
    legendItems.push(
      <Text
        key="legend-title"
        x={padding}
        y={startY}
        text="EKİPMAN AÇIKLAMALARI"
        fontSize={14}
        fontStyle="bold"
        fill="#333"
      />
    );
    
    // Ekipman türleri
    equipmentTypes.forEach((type, index) => {
      const y = startY + 25 + (index * 20);
      
      // Renk göstergesi
      legendItems.push(
        <Circle
          key={`legend-circle-${index}`}
          x={padding + 10}
          y={y}
          radius={8}
          fill={type.color}
        />
      );
      
      // Açıklama
      legendItems.push(
        <Text
          key={`legend-text-${index}`}
          x={padding + 25}
          y={y - 8}
          text={type.name}
          fontSize={12}
          fill="#333"
        />
      );
    });
    
    return legendItems;
  };

  return (
    <div className="pt-8 min-h-screen bg-gray-50">
      {/* Page Header */}
      <section className="bg-gradient-to-br from-indigo-50 to-indigo-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <Layers className="h-12 w-12 text-indigo-600 mr-4" />
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800">
              Ekipman Krokisi Tasarımcısı
            </h1>
          </div>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Zararlı mücadele ekipmanlarının yerleşimini planlamak için sürükle-bırak arayüzü.
            Profesyonel krokiler oluşturun, kaydedin ve dışa aktarın.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-8 bg-white">
        <div className="container mx-auto px-4">
          {/* Toolbar */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 flex flex-wrap gap-2 justify-between items-center">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={newLayout}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
              >
                <Plus className="h-4 w-4" />
                <span>Yeni Kroki</span>
              </button>
              <button
                onClick={() => setShowSaveModal(true)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center space-x-2"
              >
                <Save className="h-4 w-4" />
                <span>Kaydet</span>
              </button>
              <button
                onClick={() => setShowLoadModal(true)}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2"
              >
                <Layers className="h-4 w-4" />
                <span>Yükle</span>
              </button>
              <button
                onClick={exportLayout}
                className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center space-x-2"
              >
                <Download className="h-4 w-4" />
                <span>Dışa Aktar</span>
              </button>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleZoom('in')}
                className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                title="Yakınlaştır"
              >
                <Plus className="h-4 w-4" />
              </button>
              <button
                onClick={() => handleZoom('out')}
                className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                title="Uzaklaştır"
              >
                <Minus className="h-4 w-4" />
              </button>
              <button
                onClick={() => setShowGrid(!showGrid)}
                className={`p-2 rounded-lg transition-colors ${
                  showGrid ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-700'
                }`}
                title="Izgarayı Göster/Gizle"
              >
                <Grid className="h-4 w-4" />
              </button>
            </div>
          </div>

          {/* Error/Success Messages */}
          {error && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <span>{error}</span>
              </div>
              <button onClick={() => setError(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
          {success && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4 flex justify-between items-center">
              <div className="flex items-center">
                <span>{success}</span>
              </div>
              <button onClick={() => setSuccess(null)}>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}

          <div className="flex flex-col lg:flex-row gap-6">
            {/* Tools Palette */}
            <div className="lg:w-64 bg-white rounded-lg shadow-md p-4 h-fit">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Araçlar</h3>
              
              {/* Ekipmanlar */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Ekipmanlar</h4>
                <div className="space-y-2">
                  {equipmentTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => addEquipment(type.id)}
                      className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center mr-2 text-white"
                        style={{ backgroundColor: type.color }}
                      >
                        {type.id.charAt(0).toUpperCase()}
                      </div>
                      <span className="text-sm">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Kapılar */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Kapılar</h4>
                <div className="space-y-2">
                  {doorTypes.map((type) => (
                    <button
                      key={type.id}
                      onClick={() => addDoor(type.id)}
                      className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <DoorOpen className="w-6 h-6 mr-2 text-gray-700" />
                      <span className="text-sm">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Çizim Araçları */}
              <div className="mb-6">
                <h4 className="font-medium text-gray-700 mb-2">Çizim Araçları</h4>
                <div className="space-y-2">
                  <button
                    onClick={startDrawingWall}
                    className={`w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors ${isDrawingWall ? 'bg-indigo-100' : ''}`}
                  >
                    <Square className="w-6 h-6 mr-2 text-gray-700" />
                    <span className="text-sm">Duvar Çiz</span>
                  </button>
                  <button
                    onClick={() => setShowTextModal(true)}
                    className="w-full flex items-center p-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <Type className="w-6 h-6 mr-2 text-gray-700" />
                    <span className="text-sm">Metin Ekle</span>
                  </button>
                </div>
              </div>
              
              {/* Bilgi */}
              <div className="bg-blue-50 p-3 rounded-lg text-sm text-blue-700">
                <p className="mb-2 font-medium">Kullanım İpuçları:</p>
                <ul className="list-disc pl-5 space-y-1">
                  <li>Ekipmanları sürükleyerek taşıyabilirsiniz</li>
                  <li>Duvar çizmek için tıklayarak noktaları belirleyin</li>
                  <li>Duvar çizimini bitirmek için çift tıklayın</li>
                  <li>Öğeleri seçip düzenleyebilirsiniz</li>
                </ul>
              </div>
            </div>

            {/* Canvas */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-md p-4 mb-4">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-semibold text-gray-800">
                    {layoutName ? layoutName : 'Yeni Kroki'}
                  </h3>
                  <div className="text-sm text-gray-500">
                    {clientCompany ? `${clientCompany}` : 'Müşteri bilgisi yok'}
                  </div>
                </div>
                <div 
                  ref={containerRef} 
                  className="border border-gray-300 rounded-lg overflow-hidden bg-white"
                  style={{ height: `${stageSize.height}px` }}
                >
                  <Stage
                    ref={stageRef}
                    width={stageSize.width}
                    height={stageSize.height}
                    scaleX={scale}
                    scaleY={scale}
                    onMouseDown={(e) => {
                      // Boş alana tıklandığında
                      const clickedOnEmpty = e.target === e.target.getStage();
                      
                      if (isDrawingWall) {
                        // Duvar çizme modunda
                        const stage = e.target.getStage();
                        if (!stage) return;
                        
                        const pointerPos = stage.getPointerPosition();
                        if (!pointerPos) return;
                        
                        // Sahne ölçeğini hesaba kat
                        const x = (pointerPos.x - stage.x()) / stage.scaleX();
                        const y = (pointerPos.y - stage.y()) / stage.scaleY();
                        
                        // Yeni nokta ekle
                        setCurrentWallPoints([...currentWallPoints, x, y]);
                        
                        // Çift tıklama kontrolü (son iki nokta arasındaki mesafe çok küçükse)
                        if (currentWallPoints.length >= 4) {
                          const lastX = currentWallPoints[currentWallPoints.length - 2];
                          const lastY = currentWallPoints[currentWallPoints.length - 1];
                          
                          const distance = Math.sqrt(Math.pow(x - lastX, 2) + Math.pow(y - lastY, 2));
                          
                          if (distance < 10) {
                            // Çift tıklama olarak kabul et ve duvar çizimini bitir
                            finishDrawingWall();
                          }
                        }
                      } else if (clickedOnEmpty) {
                        // Normal modda boş alana tıklandığında seçimi kaldır
                        setSelectedId(null);
                        setSelectedType(null);
                      }
                    }}
                  >
                    <Layer>
                      {/* Beyaz arka plan */}
                      <Rect
                        x={0}
                        y={0}
                        width={stageSize.width}
                        height={stageSize.height}
                        fill="white"
                      />
                      
                      {/* Izgara */}
                      {renderGrid()}
                      
                      {/* Başlık ve müşteri bilgileri */}
                      {renderHeader()}
                      
                      {/* Duvarlar */}
                      {walls.map((wall) => (
                        <Wall
                          key={wall.id}
                          id={wall.id}
                          points={wall.points}
                          isSelected={selectedId === wall.id}
                          onSelect={() => {
                            setSelectedId(wall.id);
                            setSelectedType('wall');
                          }}
                          onChange={(newAttrs) => updateWall(wall.id, newAttrs)}
                        />
                      ))}
                      
                      {/* Çizilmekte olan duvar */}
                      {isDrawingWall && currentWallPoints.length >= 2 && (
                        <Line
                          points={currentWallPoints}
                          stroke="#333"
                          strokeWidth={6}
                          lineCap="round"
                          lineJoin="round"
                        />
                      )}
                      
                      {/* Kapılar */}
                      {doors.map((door) => (
                        <Door
                          key={door.id}
                          id={door.id}
                          x={door.x}
                          y={door.y}
                          width={door.width}
                          height={door.height}
                          rotation={door.rotation}
                          type={door.type}
                          isSelected={selectedId === door.id}
                          onSelect={() => {
                            setSelectedId(door.id);
                            setSelectedType('door');
                          }}
                          onChange={(newAttrs) => updateDoor(door.id, newAttrs)}
                        />
                      ))}
                      
                      {/* Metinler */}
                      {texts.map((textItem) => (
                        <TextItem
                          key={textItem.id}
                          id={textItem.id}
                          x={textItem.x}
                          y={textItem.y}
                          text={textItem.text}
                          fontSize={textItem.fontSize}
                          isSelected={selectedId === textItem.id}
                          onSelect={() => {
                            setSelectedId(textItem.id);
                            setSelectedType('text');
                          }}
                          onChange={(newAttrs) => updateText(textItem.id, newAttrs)}
                        />
                      ))}
                      
                      {/* Ekipmanlar */}
                      {equipments.map((equipment) => (
                        <Equipment
                          key={equipment.id}
                          id={equipment.id}
                          x={equipment.x}
                          y={equipment.y}
                          type={equipment.type}
                          rotation={equipment.rotation}
                          label={equipment.label}
                          isSelected={equipment.id === selectedId}
                          onSelect={() => {
                            setSelectedId(equipment.id);
                            setSelectedType('equipment');
                          }}
                          onChange={(newAttrs) => updateEquipment(equipment.id, newAttrs)}
                        />
                      ))}
                      
                      {/* Ekipman açıklamaları */}
                      {renderLegend()}
                    </Layer>
                  </Stage>
                </div>
              </div>

              {/* Selected Item Controls */}
              {selectedId && selectedType && (
                <div className="bg-white rounded-lg shadow-md p-4">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4">
                    {selectedType === 'equipment' ? 'Seçili Ekipman' : 
                     selectedType === 'wall' ? 'Seçili Duvar' : 
                     selectedType === 'door' ? 'Seçili Kapı' : 'Seçili Metin'}
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {(selectedType === 'equipment' || selectedType === 'door') && (
                      <>
                        <button
                          onClick={() => rotateSelected('ccw')}
                          className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                          title="Saat Yönünün Tersine Döndür"
                        >
                          <RotateCcw className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => rotateSelected('cw')}
                          className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                          title="Saat Yönünde Döndür"
                        >
                          <RotateCw className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    
                    {(selectedType === 'equipment' || selectedType === 'door' || selectedType === 'text') && (
                      <button
                        onClick={duplicateSelected}
                        className="bg-gray-200 text-gray-700 p-2 rounded-lg hover:bg-gray-300 transition-colors"
                        title="Kopyala"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                    )}
                    
                    <button
                      onClick={deleteSelected}
                      className="bg-red-600 text-white p-2 rounded-lg hover:bg-red-700 transition-colors"
                      title="Sil"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    
                    {/* Ekipman etiket düzenleme */}
                    {selectedType === 'equipment' && (
                      <div className="flex-1 min-w-[200px]">
                        <input
                          type="text"
                          value={equipments.find(e => e.id === selectedId)?.label || ''}
                          onChange={(e) => {
                            const newLabel = e.target.value;
                            updateEquipment(selectedId, { label: newLabel });
                          }}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="Ekipman No"
                        />
                      </div>
                    )}
                    
                    {/* Metin düzenleme */}
                    {selectedType === 'text' && (
                      <div className="flex-1 min-w-[200px]">
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={texts.find(t => t.id === selectedId)?.text || ''}
                            onChange={(e) => {
                              const newText = e.target.value;
                              updateText(selectedId, { text: newText });
                            }}
                            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Metin"
                          />
                          <input
                            type="number"
                            value={texts.find(t => t.id === selectedId)?.fontSize || 16}
                            onChange={(e) => {
                              const newSize = parseInt(e.target.value);
                              if (newSize > 0) {
                                updateText(selectedId, { fontSize: newSize });
                              }
                            }}
                            className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                            placeholder="Boyut"
                            min="8"
                            max="72"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
              
              {/* Drawing Wall Instructions */}
              {isDrawingWall && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mt-4">
                  <div className="flex items-start">
                    <div className="flex-1">
                      <h4 className="font-medium text-yellow-800 mb-2">Duvar Çizme Modu</h4>
                      <p className="text-sm text-yellow-700">
                        Duvar çizmek için sahne üzerinde tıklayarak noktaları belirleyin. 
                        Çizimi tamamlamak için son noktaya yakın bir yere çift tıklayın veya aşağıdaki butona basın.
                      </p>
                    </div>
                    <button
                      onClick={finishDrawingWall}
                      className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors ml-4"
                    >
                      Çizimi Tamamla
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Save Modal */}
      {showSaveModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Kroki Kaydet</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Kroki Adı *
                </label>
                <input
                  type="text"
                  value={layoutName}
                  onChange={(e) => setLayoutName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Örn: Fabrika A Blok Kroki"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Firma Adı *
                </label>
                <input
                  type="text"
                  value={clientCompany}
                  onChange={(e) => setClientCompany(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Örn: ABC Gıda Ltd. Şti."
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Müşteri Adresi
                </label>
                <textarea
                  value={clientAddress}
                  onChange={(e) => setClientAddress(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Örn: Organize Sanayi Bölgesi, 1. Cadde, No: 123"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Firma Logo URL (opsiyonel)
                </label>
                <input
                  type="text"
                  value={logoUrl}
                  onChange={(e) => setLogoUrl(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Örn: https://example.com/logo.png"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowSaveModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={saveLayout}
                disabled={saving || !layoutName || !clientCompany}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
              >
                {saving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Kaydediliyor...</span>
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    <span>Kaydet</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-bold text-gray-900">Kaydedilmiş Krokiler</h3>
              <button
                onClick={() => setShowLoadModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            {loading ? (
              <div className="py-8 text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
                <p className="mt-2 text-gray-600">Krokiler yükleniyor...</p>
              </div>
            ) : layouts.length === 0 ? (
              <div className="py-8 text-center">
                <FileText className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">Henüz kaydedilmiş kroki bulunmuyor.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {layouts.map((layout) => (
                  <div
                    key={layout.id}
                    className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors cursor-pointer"
                    onClick={() => loadLayout(layout)}
                  >
                    <div className="flex items-start">
                      <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden flex-shrink-0 mr-4">
                        {layout.exported_image_url ? (
                          <img
                            src={layout.exported_image_url}
                            alt={layout.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <ImageIcon className="h-8 w-8 text-gray-400" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900">{layout.name}</h4>
                        <div className="text-sm text-gray-500 flex items-center mt-1">
                          <Building className="h-3 w-3 mr-1" />
                          {layout.client_company_name}
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {new Date(layout.created_at).toLocaleDateString('tr-TR')}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Text Modal */}
      {showTextModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Metin Ekle</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Metin
                </label>
                <input
                  type="text"
                  value={newTextValue}
                  onChange={(e) => setNewTextValue(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Metin girin"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Yazı Boyutu
                </label>
                <input
                  type="number"
                  value={newTextSize}
                  onChange={(e) => setNewTextSize(parseInt(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="Yazı boyutu"
                  min="8"
                  max="72"
                />
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowTextModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                İptal
              </button>
              <button
                onClick={addText}
                disabled={!newTextValue.trim()}
                className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ekle
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LayoutDesignerPage;