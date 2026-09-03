/**
 * Tabla de alimentos con macros por 100 g (o 100 ml en bebidas). Valores
 * redondeados a partir de las tablas BEDCA/USDA; sirven para calcular una
 * comida al momento sin llamar al modelo y con el mismo resultado siempre.
 */

export interface Alimento {
  id: string;
  nombre: string;
  /** Otros nombres con los que la gente lo escribe. */
  alias: string[];
  kcal: number;
  proteina: number;
  carbos: number;
  grasa: number;
  /** Gramos de una unidad habitual ("1 huevo", "1 platano") si tiene sentido. */
  porcion?: { gramos: number; nombre: string };
  /** Unidades de alcohol por 100 ml, solo bebidas alcoholicas. */
  alcoholPor100?: number;
}

const a = (
  id: string,
  nombre: string,
  alias: string[],
  kcal: number,
  proteina: number,
  carbos: number,
  grasa: number,
  porcion?: { gramos: number; nombre: string },
  alcoholPor100?: number,
): Alimento => ({ id, nombre, alias, kcal, proteina, carbos, grasa, porcion, alcoholPor100 });

export const ALIMENTOS: Alimento[] = [
  // ── Proteinas ──────────────────────────────────────────────────────
  a('pollo_pechuga', 'Pechuga de pollo', ['pollo', 'pechuga', 'pollo a la plancha'], 120, 23, 0, 2.6, { gramos: 150, nombre: 'filete' }),
  a('pollo_muslo', 'Muslo de pollo sin piel', ['muslo', 'contramuslo', 'muslos de pollo'], 120, 20, 0, 4, { gramos: 120, nombre: 'muslo' }),
  a('pavo', 'Pechuga de pavo', ['pavo', 'fiambre de pavo'], 105, 24, 0, 1, { gramos: 30, nombre: 'loncha' }),
  a('ternera', 'Ternera magra', ['ternera', 'filete de ternera', 'solomillo', 'entrecot', 'carne'], 150, 21, 0, 7, { gramos: 150, nombre: 'filete' }),
  a('carne_picada', 'Carne picada', ['picada', 'carne picada', 'hamburguesa casera'], 176, 20, 0, 10, { gramos: 120, nombre: 'hamburguesa' }),
  a('cerdo_lomo', 'Lomo de cerdo', ['lomo', 'cerdo', 'lomo de cerdo', 'filete de lomo'], 140, 22, 0, 5, { gramos: 100, nombre: 'filete' }),
  a('jamon_serrano', 'Jamon serrano', ['jamon', 'jamon serrano', 'jamon iberico'], 240, 30, 0, 13, { gramos: 20, nombre: 'loncha' }),
  a('jamon_cocido', 'Jamon cocido', ['jamon york', 'york', 'jamon cocido', 'fiambre'], 110, 18, 1, 3, { gramos: 25, nombre: 'loncha' }),
  a('huevo', 'Huevo', ['huevos', 'huevo cocido', 'huevo frito', 'huevos revueltos', 'tortilla francesa'], 143, 12.6, 0.7, 9.5, { gramos: 55, nombre: 'huevo' }),
  a('clara', 'Clara de huevo', ['claras', 'clara'], 52, 11, 0.7, 0.2, { gramos: 33, nombre: 'clara' }),
  a('atun_natural', 'Atun al natural', ['atun', 'atun natural', 'lata de atun', 'atun en lata'], 110, 25, 0, 1, { gramos: 80, nombre: 'lata' }),
  a('atun_aceite', 'Atun en aceite', ['atun en aceite', 'atun con aceite'], 190, 25, 0, 10, { gramos: 80, nombre: 'lata' }),
  a('salmon', 'Salmon', ['salmon', 'salmon a la plancha', 'salmon ahumado'], 200, 20, 0, 13, { gramos: 150, nombre: 'filete' }),
  a('merluza', 'Merluza', ['merluza', 'pescado blanco', 'bacalao', 'lubina', 'dorada'], 85, 17, 0, 1.5, { gramos: 150, nombre: 'filete' }),
  a('gambas', 'Gambas', ['gambas', 'langostinos', 'gambones', 'camarones'], 90, 20, 0, 1),
  a('tofu', 'Tofu', ['tofu'], 80, 9, 2, 4.5),
  a('whey', 'Proteina en polvo', ['proteina', 'whey', 'batido de proteina', 'batido de proteinas', 'scoop'], 380, 75, 8, 6, { gramos: 30, nombre: 'cazo' }),

  // ── Lacteos ────────────────────────────────────────────────────────
  a('leche_entera', 'Leche entera', ['leche entera'], 62, 3.2, 4.7, 3.6, { gramos: 250, nombre: 'vaso' }),
  a('leche_semi', 'Leche semidesnatada', ['leche', 'leche semi', 'leche semidesnatada'], 46, 3.3, 4.8, 1.6, { gramos: 250, nombre: 'vaso' }),
  a('leche_desnatada', 'Leche desnatada', ['leche desnatada'], 34, 3.4, 4.8, 0.1, { gramos: 250, nombre: 'vaso' }),
  a('yogur', 'Yogur natural', ['yogur', 'yogurt', 'yogur natural'], 60, 4, 5, 3, { gramos: 125, nombre: 'yogur' }),
  a('yogur_griego', 'Yogur griego', ['yogur griego', 'griego'], 100, 5, 4, 7, { gramos: 125, nombre: 'yogur' }),
  a('skyr', 'Queso fresco batido 0%', ['skyr', 'queso batido', 'queso fresco batido'], 60, 10, 4, 0.2, { gramos: 150, nombre: 'tarrina' }),
  a('queso_curado', 'Queso curado', ['queso', 'queso curado', 'queso manchego', 'queso semicurado'], 400, 28, 0, 32, { gramos: 30, nombre: 'loncha' }),
  a('queso_fresco', 'Queso fresco', ['queso fresco', 'burgos'], 200, 14, 2, 15),
  a('mozzarella', 'Mozzarella', ['mozzarella'], 280, 18, 2, 22, { gramos: 125, nombre: 'bola' }),

  // ── Carbohidratos ──────────────────────────────────────────────────
  a('arroz_cocido', 'Arroz cocido', ['arroz', 'arroz cocido', 'arroz hervido', 'arroz blanco'], 130, 2.7, 28, 0.3, { gramos: 180, nombre: 'plato' }),
  a('arroz_crudo', 'Arroz crudo', ['arroz crudo', 'arroz en seco', 'arroz en crudo'], 360, 7, 79, 0.6),
  a('pasta_cocida', 'Pasta cocida', ['pasta', 'macarrones', 'espaguetis', 'pasta cocida', 'fideos'], 155, 5.5, 30, 1, { gramos: 200, nombre: 'plato' }),
  a('pasta_cruda', 'Pasta cruda', ['pasta cruda', 'pasta en seco', 'pasta en crudo'], 355, 12, 72, 1.5),
  a('patata', 'Patata cocida o asada', ['patata', 'patatas', 'patata cocida', 'patata asada', 'pure de patata'], 85, 1.9, 19, 0.1, { gramos: 150, nombre: 'patata' }),
  a('patatas_fritas', 'Patatas fritas', ['patatas fritas', 'fritas'], 310, 3.5, 40, 15, { gramos: 150, nombre: 'racion' }),
  a('boniato', 'Boniato', ['boniato', 'batata'], 90, 1.6, 21, 0.1, { gramos: 150, nombre: 'boniato' }),
  a('pan', 'Pan blanco', ['pan', 'pan blanco', 'barra', 'baguette', 'rebanada'], 265, 9, 50, 3, { gramos: 30, nombre: 'rebanada' }),
  a('pan_integral', 'Pan integral', ['pan integral', 'integral'], 250, 11, 44, 3.5, { gramos: 30, nombre: 'rebanada' }),
  a('tostada', 'Tostada', ['tostada', 'tostadas'], 265, 9, 50, 3, { gramos: 30, nombre: 'tostada' }),
  a('avena', 'Copos de avena', ['avena', 'copos de avena', 'porridge', 'gachas'], 375, 13, 60, 7, { gramos: 40, nombre: 'racion' }),
  a('quinoa', 'Quinoa cocida', ['quinoa'], 120, 4.4, 21, 1.9),
  a('lentejas', 'Lentejas cocidas', ['lentejas', 'lentejas cocidas'], 115, 9, 20, 0.4, { gramos: 250, nombre: 'plato' }),
  a('garbanzos', 'Garbanzos cocidos', ['garbanzos', 'hummus'], 140, 8, 22, 2.5, { gramos: 250, nombre: 'plato' }),
  a('alubias', 'Alubias cocidas', ['alubias', 'judias', 'frijoles', 'judias blancas'], 110, 7, 19, 0.5, { gramos: 250, nombre: 'plato' }),
  a('tortilla_trigo', 'Tortilla de trigo', ['tortilla de trigo', 'wrap', 'fajita', 'tortita'], 300, 8, 50, 8, { gramos: 40, nombre: 'tortilla' }),
  a('cereales', 'Cereales de desayuno', ['cereales', 'corn flakes', 'muesli', 'granola'], 380, 8, 75, 5, { gramos: 40, nombre: 'bol' }),

  // ── Fruta ──────────────────────────────────────────────────────────
  a('platano', 'Platano', ['platano', 'platanos', 'banana'], 90, 1, 21, 0.3, { gramos: 120, nombre: 'platano' }),
  a('manzana', 'Manzana', ['manzana', 'manzanas'], 52, 0.3, 12, 0.2, { gramos: 180, nombre: 'manzana' }),
  a('naranja', 'Naranja', ['naranja', 'naranjas', 'mandarina', 'mandarinas'], 47, 0.9, 10, 0.1, { gramos: 200, nombre: 'naranja' }),
  a('pera', 'Pera', ['pera', 'peras'], 57, 0.4, 15, 0.1, { gramos: 170, nombre: 'pera' }),
  a('fresas', 'Fresas', ['fresas', 'fresa', 'frutos rojos'], 32, 0.7, 6, 0.3, { gramos: 150, nombre: 'racion' }),
  a('arandanos', 'Arandanos', ['arandanos'], 57, 0.7, 12, 0.3, { gramos: 100, nombre: 'racion' }),
  a('uvas', 'Uvas', ['uvas'], 69, 0.7, 16, 0.2, { gramos: 150, nombre: 'racion' }),
  a('sandia', 'Sandia', ['sandia', 'melon'], 30, 0.6, 7, 0.2, { gramos: 200, nombre: 'racion' }),
  a('aguacate', 'Aguacate', ['aguacate', 'medio aguacate', 'palta'], 160, 2, 2, 15, { gramos: 100, nombre: 'medio' }),
  a('kiwi', 'Kiwi', ['kiwi', 'kiwis'], 60, 1.1, 14, 0.5, { gramos: 90, nombre: 'kiwi' }),

  // ── Verdura ────────────────────────────────────────────────────────
  a('ensalada', 'Ensalada mixta', ['ensalada', 'ensalada mixta', 'lechuga', 'mezclum'], 20, 1.2, 3, 0.2, { gramos: 150, nombre: 'plato' }),
  a('brocoli', 'Brocoli', ['brocoli', 'coliflor'], 34, 2.8, 5, 0.4, { gramos: 150, nombre: 'racion' }),
  a('espinacas', 'Espinacas', ['espinacas', 'acelgas'], 23, 2.9, 2, 0.4, { gramos: 150, nombre: 'racion' }),
  a('tomate', 'Tomate', ['tomate', 'tomates'], 18, 0.9, 3, 0.2, { gramos: 120, nombre: 'tomate' }),
  a('zanahoria', 'Zanahoria', ['zanahoria', 'zanahorias'], 41, 0.9, 9, 0.2, { gramos: 80, nombre: 'zanahoria' }),
  a('pimiento', 'Pimiento', ['pimiento', 'pimientos'], 26, 1, 5, 0.3, { gramos: 120, nombre: 'pimiento' }),
  a('cebolla', 'Cebolla', ['cebolla'], 40, 1.1, 9, 0.1, { gramos: 100, nombre: 'cebolla' }),
  a('calabacin', 'Calabacin', ['calabacin', 'berenjena'], 17, 1.2, 3, 0.3, { gramos: 200, nombre: 'calabacin' }),
  a('champinones', 'Champinones', ['champinones', 'setas'], 22, 3, 2, 0.3, { gramos: 150, nombre: 'racion' }),
  a('verduras', 'Verduras salteadas', ['verduras', 'verdura', 'salteado de verduras', 'menestra'], 45, 2, 6, 1.5, { gramos: 200, nombre: 'racion' }),

  // ── Grasas y frutos secos ──────────────────────────────────────────
  a('aceite', 'Aceite de oliva', ['aceite', 'aceite de oliva', 'aove'], 884, 0, 0, 100, { gramos: 10, nombre: 'cucharada' }),
  a('mantequilla', 'Mantequilla', ['mantequilla'], 717, 0.9, 0, 81, { gramos: 10, nombre: 'cucharada' }),
  a('almendras', 'Almendras', ['almendras', 'frutos secos', 'anacardos', 'pistachos'], 580, 21, 9, 50, { gramos: 30, nombre: 'punado' }),
  a('nueces', 'Nueces', ['nueces'], 650, 15, 7, 65, { gramos: 30, nombre: 'punado' }),
  a('crema_cacahuete', 'Crema de cacahuete', ['crema de cacahuete', 'cacahuetes', 'mantequilla de cacahuete'], 590, 25, 12, 50, { gramos: 15, nombre: 'cucharada' }),
  a('chocolate_negro', 'Chocolate negro', ['chocolate', 'chocolate negro', 'onza de chocolate'], 590, 10, 20, 45, { gramos: 10, nombre: 'onza' }),
  a('aceitunas', 'Aceitunas', ['aceitunas', 'olivas'], 145, 1, 1, 15, { gramos: 30, nombre: 'racion' }),

  // ── Platos preparados ──────────────────────────────────────────────
  a('tortilla_patatas', 'Tortilla de patatas', ['tortilla de patatas', 'tortilla de patata', 'tortilla espanola'], 180, 6, 12, 12, { gramos: 150, nombre: 'racion' }),
  a('pizza', 'Pizza', ['pizza', 'porcion de pizza'], 270, 11, 33, 10, { gramos: 120, nombre: 'porcion' }),
  a('hamburguesa', 'Hamburguesa completa', ['hamburguesa', 'burger', 'hamburguesa con pan'], 250, 13, 25, 11, { gramos: 220, nombre: 'hamburguesa' }),
  a('bocadillo', 'Bocadillo', ['bocadillo', 'bocata', 'sandwich', 'bocadillo de jamon'], 250, 12, 35, 7, { gramos: 200, nombre: 'bocadillo' }),
  a('paella', 'Paella', ['paella', 'arroz con pollo', 'arroz con cosas'], 160, 7, 22, 5, { gramos: 250, nombre: 'plato' }),
  a('lasana', 'Lasana', ['lasana', 'lasagna', 'canelones'], 150, 8, 13, 7, { gramos: 300, nombre: 'racion' }),
  a('sushi', 'Sushi', ['sushi', 'maki', 'nigiri'], 150, 6, 28, 2, { gramos: 30, nombre: 'pieza' }),
  a('croissant', 'Croissant', ['croissant', 'cruasan', 'bolleria', 'napolitana', 'donut'], 400, 8, 45, 21, { gramos: 60, nombre: 'unidad' }),
  a('galletas', 'Galletas', ['galletas', 'galleta'], 450, 7, 70, 16, { gramos: 8, nombre: 'galleta' }),
  a('sopa', 'Sopa o caldo', ['sopa', 'caldo', 'crema de verduras', 'gazpacho'], 40, 2, 5, 1.5, { gramos: 250, nombre: 'plato' }),
  a('guiso', 'Cocido o guiso de legumbre con carne', ['cocido', 'cocido madrileno', 'fabada', 'guiso', 'potaje', 'estofado'], 140, 9, 12, 6, { gramos: 350, nombre: 'plato' }),
  a('flan', 'Flan o natillas', ['flan', 'natillas', 'arroz con leche'], 120, 4, 20, 3, { gramos: 110, nombre: 'unidad' }),
  a('helado', 'Helado', ['helado', 'bola de helado'], 210, 3.5, 25, 11, { gramos: 70, nombre: 'bola' }),
  a('tarta', 'Tarta o pastel', ['tarta', 'pastel', 'bizcocho', 'brownie', 'cheesecake'], 350, 5, 45, 17, { gramos: 100, nombre: 'trozo' }),

  // ── Bebidas ────────────────────────────────────────────────────────
  a('cerveza', 'Cerveza', ['cerveza', 'tercio', 'birra', 'cervezas', 'tercios', 'lata de cerveza'], 43, 0.5, 3.6, 0, { gramos: 330, nombre: 'tercio' }, 0.3),
  a('cana', 'Cana de cerveza', ['cana', 'canas', 'cana de cerveza'], 43, 0.5, 3.6, 0, { gramos: 200, nombre: 'cana' }, 0.3),
  a('cerveza_sin', 'Cerveza sin alcohol', ['cerveza sin', 'sin alcohol', 'cerveza 0.0', 'cerveza sin alcohol'], 25, 0.4, 5, 0, { gramos: 330, nombre: 'tercio' }),
  a('vino', 'Vino', ['vino', 'copa de vino', 'vino tinto', 'vino blanco', 'copa'], 85, 0, 2.6, 0, { gramos: 150, nombre: 'copa' }, 0.67),
  a('gin_tonic', 'Copa (gin tonic, cubata)', ['gin tonic', 'cubata', 'ron cola', 'copa de alcohol', 'combinado', 'whisky'], 100, 0, 8, 0, { gramos: 250, nombre: 'copa' }, 0.8),
  a('refresco', 'Refresco', ['refresco', 'refrescos', 'coca cola', 'cocacola', 'fanta', 'cola', 'pepsi', 'sprite', 'seven up', 'kas', 'aquarius', 'nestea', 'tonica'], 42, 0, 10.6, 0, { gramos: 330, nombre: 'lata' }),
  a('energetica', 'Bebida energetica', ['red bull', 'redbull', 'monster', 'bebida energetica', 'energetica', 'burn'], 45, 0, 11, 0, { gramos: 250, nombre: 'lata' }),
  a('refresco_zero', 'Refresco zero', ['zero', 'coca cola zero', 'cocacola zero', 'light', 'refresco zero', 'refrescos zero', 'cola zero', 'pepsi zero', 'pepsi max', 'fanta zero', 'aquarius zero', 'nestea zero', 'sprite zero', 'red bull zero', 'redbull zero', 'monster zero', 'monster ultra', 'bebida energetica zero', 'tonica zero', 'kas zero'], 0, 0, 0, 0, { gramos: 330, nombre: 'lata' }),
  a('zumo', 'Zumo de naranja', ['zumo', 'zumo de naranja', 'jugo'], 45, 0.7, 10, 0.2, { gramos: 200, nombre: 'vaso' }),
  a('cafe_leche', 'Cafe con leche', ['cafe con leche', 'cortado', 'latte', 'capuchino'], 27, 1.4, 2.1, 1.3, { gramos: 150, nombre: 'taza' }),
  a('cafe', 'Cafe solo', ['cafe', 'cafe solo', 'espresso', 'americano'], 2, 0.1, 0, 0, { gramos: 60, nombre: 'taza' }),

  // ── Mas fruta ──────────────────────────────────────────────────────
  a('nectarina', 'Nectarina', ['nectarina', 'nectarinas'], 44, 1.1, 9, 0.3, { gramos: 140, nombre: 'nectarina' }),
  a('melocoton', 'Melocoton', ['melocoton', 'melocotones', 'durazno', 'paraguayo', 'paraguayos'], 40, 0.9, 9, 0.2, { gramos: 150, nombre: 'melocoton' }),
  a('ciruela', 'Ciruela', ['ciruela', 'ciruelas'], 46, 0.7, 11, 0.3, { gramos: 60, nombre: 'ciruela' }),
  a('cerezas', 'Cerezas', ['cereza', 'cerezas', 'picota', 'picotas'], 63, 1, 14, 0.2, { gramos: 100, nombre: 'punado' }),
  a('mango', 'Mango', ['mango', 'mangos'], 60, 0.8, 15, 0.4, { gramos: 200, nombre: 'mango' }),
  a('pina', 'Pina', ['pina', 'rodaja de pina'], 50, 0.5, 12, 0.1, { gramos: 100, nombre: 'rodaja' }),
  a('melon', 'Melon', ['melon', 'raja de melon'], 34, 0.8, 8, 0.2, { gramos: 200, nombre: 'raja' }),
  a('mandarina', 'Mandarina', ['mandarina', 'mandarinas', 'clementina', 'clementinas'], 47, 0.8, 11, 0.2, { gramos: 80, nombre: 'mandarina' }),
  a('granada', 'Granada', ['granada', 'granadas'], 83, 1.7, 19, 1.2, { gramos: 150, nombre: 'granada' }),
  a('higos', 'Higos', ['higo', 'higos', 'breva', 'brevas'], 74, 0.8, 16, 0.3, { gramos: 50, nombre: 'higo' }),
  a('papaya', 'Papaya', ['papaya'], 43, 0.5, 11, 0.3, { gramos: 150, nombre: 'racion' }),
  a('frambuesas', 'Frambuesas', ['frambuesa', 'frambuesas', 'moras', 'frutos rojos'], 52, 1.2, 12, 0.7, { gramos: 100, nombre: 'punado' }),
  a('albaricoque', 'Albaricoque', ['albaricoque', 'albaricoques'], 48, 1.4, 11, 0.4, { gramos: 40, nombre: 'albaricoque' }),
  a('caqui', 'Caqui', ['caqui', 'caquis', 'kaki', 'persimon'], 70, 0.6, 18, 0.2, { gramos: 170, nombre: 'caqui' }),
  a('coco', 'Coco', ['coco'], 354, 3.3, 15, 33),
  a('datiles', 'Datiles', ['datil', 'datiles'], 282, 2.5, 75, 0.4, { gramos: 8, nombre: 'datil' }),
  a('pasas', 'Pasas', ['pasas', 'uvas pasas'], 300, 3, 79, 0.5, { gramos: 30, nombre: 'punado' }),
  a('fruta_desecada', 'Orejones', ['orejones', 'orejon', 'fruta desecada', 'ciruelas pasas'], 240, 3.4, 63, 0.5, { gramos: 30, nombre: 'punado' }),
  a('macedonia', 'Macedonia de frutas', ['macedonia', 'ensalada de frutas'], 50, 0.7, 12, 0.2, { gramos: 200, nombre: 'bol' }),

  // ── Mas verdura ────────────────────────────────────────────────────
  a('judias_verdes', 'Judias verdes', ['judias verdes', 'judia verde', 'vainas'], 31, 1.8, 7, 0.2, { gramos: 200, nombre: 'plato' }),
  a('coliflor', 'Coliflor', ['coliflor'], 25, 1.9, 5, 0.3, { gramos: 200, nombre: 'plato' }),
  a('berenjena', 'Berenjena', ['berenjena', 'berenjenas'], 25, 1, 6, 0.2, { gramos: 200, nombre: 'berenjena' }),
  a('pepino', 'Pepino', ['pepino', 'pepinos'], 15, 0.7, 3.6, 0.1, { gramos: 100, nombre: 'medio pepino' }),
  a('esparragos', 'Esparragos', ['esparragos', 'esparrago', 'esparragos trigueros', 'trigueros'], 20, 2.2, 3.9, 0.1, { gramos: 100, nombre: 'racion' }),
  a('acelgas', 'Acelgas', ['acelgas', 'acelga'], 19, 1.8, 3.7, 0.2, { gramos: 200, nombre: 'plato' }),
  a('col', 'Col / repollo', ['col', 'repollo', 'lombarda', 'col rizada', 'kale'], 25, 1.3, 6, 0.1, { gramos: 150, nombre: 'plato' }),
  a('coles_bruselas', 'Coles de Bruselas', ['coles de bruselas', 'col de bruselas'], 43, 3.4, 9, 0.3, { gramos: 150, nombre: 'plato' }),
  a('puerro', 'Puerro', ['puerro', 'puerros'], 61, 1.5, 14, 0.3, { gramos: 100, nombre: 'puerro' }),
  a('alcachofa', 'Alcachofa', ['alcachofa', 'alcachofas'], 47, 3.3, 11, 0.2, { gramos: 120, nombre: 'alcachofa' }),
  a('maiz', 'Maiz dulce', ['maiz', 'maiz dulce'], 86, 3.3, 19, 1.4, { gramos: 80, nombre: 'racion' }),
  a('guisantes', 'Guisantes', ['guisantes', 'guisante'], 81, 5.4, 14, 0.4, { gramos: 100, nombre: 'racion' }),
  a('edamame', 'Edamame', ['edamame', 'habas de soja'], 121, 11, 9, 5, { gramos: 100, nombre: 'racion' }),
  a('gazpacho', 'Gazpacho', ['gazpacho', 'salmorejo'], 45, 1, 5, 2.5, { gramos: 250, nombre: 'vaso' }),
  a('pisto', 'Pisto', ['pisto', 'ratatouille', 'sanfaina'], 85, 1.5, 7, 6, { gramos: 200, nombre: 'plato' }),
  a('crema_verduras', 'Crema de verduras', ['crema de verduras', 'crema de calabacin', 'crema de calabaza', 'pure de verduras', 'crema'], 50, 1.5, 6, 2.5, { gramos: 250, nombre: 'bol' }),

  // ── Mas proteina ───────────────────────────────────────────────────
  a('pollo_entero', 'Pollo asado con piel', ['pollo asado', 'pollo con piel', 'alitas', 'alitas de pollo', 'muslo con piel'], 220, 25, 0, 13, { gramos: 150, nombre: 'racion' }),
  a('pavo_picado', 'Pavo picado', ['pavo picado', 'carne picada de pavo', 'hamburguesa de pavo'], 150, 20, 0, 8, { gramos: 120, nombre: 'hamburguesa' }),
  a('conejo', 'Conejo', ['conejo'], 135, 21, 0, 5.5, { gramos: 150, nombre: 'racion' }),
  a('cordero', 'Cordero', ['cordero', 'chuletas de cordero', 'chuleta de cordero'], 250, 18, 0, 20, { gramos: 150, nombre: 'racion' }),
  a('chuleta_cerdo', 'Chuleta de cerdo', ['chuleta', 'chuletas', 'chuleta de cerdo', 'secreto', 'costillas'], 230, 20, 0, 17, { gramos: 150, nombre: 'chuleta' }),
  a('bacon', 'Bacon', ['bacon', 'beicon', 'panceta'], 400, 14, 1, 38, { gramos: 25, nombre: 'loncha' }),
  a('chorizo', 'Chorizo', ['chorizo', 'salchichon', 'fuet', 'embutido', 'lomo embuchado'], 380, 22, 2, 32, { gramos: 30, nombre: 'racion' }),
  a('salchichas', 'Salchichas', ['salchicha', 'salchichas', 'frankfurt'], 290, 12, 2, 26, { gramos: 50, nombre: 'salchicha' }),
  a('sardinas', 'Sardinas', ['sardina', 'sardinas', 'boquerones', 'anchoas', 'caballa'], 200, 22, 0, 12, { gramos: 100, nombre: 'racion' }),
  a('sardinas_lata', 'Sardinas en lata', ['sardinas en lata', 'lata de sardinas', 'sardinillas', 'caballa en lata', 'mejillones en lata', 'lata de mejillones'], 210, 22, 1, 13, { gramos: 90, nombre: 'lata' }),
  a('calamares', 'Calamares', ['calamar', 'calamares', 'sepia', 'chipirones', 'pulpo'], 90, 16, 2, 1.5, { gramos: 150, nombre: 'racion' }),
  a('calamares_fritos', 'Calamares fritos', ['calamares fritos', 'calamares a la romana', 'rabas'], 200, 15, 15, 9, { gramos: 150, nombre: 'racion' }),
  a('surimi', 'Surimi / palitos de cangrejo', ['surimi', 'palitos de cangrejo'], 95, 8, 12, 1, { gramos: 17, nombre: 'palito' }),
  a('seitan', 'Seitan', ['seitan'], 130, 25, 4, 2),
  a('tempeh', 'Tempeh', ['tempeh'], 190, 19, 8, 11),
  a('soja_texturizada', 'Soja texturizada (seca)', ['soja texturizada', 'soja'], 340, 50, 20, 2, { gramos: 30, nombre: 'racion' }),
  a('hummus', 'Hummus', ['hummus', 'humus'], 180, 7, 15, 10, { gramos: 50, nombre: 'racion' }),
  a('queso_cottage', 'Queso cottage / requeson', ['cottage', 'requeson', 'queso cottage'], 98, 11, 3.4, 4.3, { gramos: 150, nombre: 'tarrina' }),
  a('queso_semicurado', 'Queso semicurado', ['queso semicurado', 'queso de oveja', 'manchego', 'gouda', 'edam', 'havarti', 'queso en lonchas'], 350, 25, 1, 27, { gramos: 30, nombre: 'racion' }),
  a('queso_untar', 'Queso de untar', ['queso de untar', 'philadelphia', 'queso crema', 'queso untable'], 250, 6, 4, 24, { gramos: 30, nombre: 'racion' }),
  a('kefir', 'Kefir', ['kefir'], 55, 3.3, 4, 3, { gramos: 200, nombre: 'vaso' }),
  a('yogur_proteico', 'Yogur proteico', ['yogur proteico', 'yogur de proteinas', 'yopro', 'hipro', 'yogur alto en proteina', 'yogur proteinas'], 65, 10, 5, 0.3, { gramos: 200, nombre: 'yogur' }),
  a('leche_avena', 'Bebida de avena / almendra', ['leche de avena', 'bebida de avena', 'leche de almendra', 'bebida de almendra', 'leche vegetal', 'leche de soja', 'bebida de soja'], 45, 1, 6.5, 1.5, { gramos: 250, nombre: 'vaso' }),
  a('barrita_proteica', 'Barrita proteica', ['barrita proteica', 'barrita de proteina', 'barrita'], 370, 30, 30, 12, { gramos: 55, nombre: 'barrita' }),
  a('tortilla_2huevos', 'Tortilla francesa', ['tortilla francesa', 'tortilla de 2 huevos', 'tortilla de queso', 'tortilla de jamon'], 165, 12, 1, 12, { gramos: 120, nombre: 'tortilla' }),

  // ── Mas hidratos y desayuno ────────────────────────────────────────
  a('pan_molde', 'Pan de molde', ['pan de molde', 'pan bimbo', 'sandwich', 'sandwich mixto'], 250, 8, 46, 4, { gramos: 25, nombre: 'rebanada' }),
  a('pan_centeno', 'Pan de centeno', ['pan de centeno', 'centeno', 'pan de espelta', 'pan de masa madre'], 250, 8, 48, 1.5, { gramos: 40, nombre: 'rebanada' }),
  a('pan_tostado', 'Pan tostado / biscotes', ['biscote', 'biscotes', 'pan tostado', 'tostadas de pan'], 380, 11, 75, 4, { gramos: 10, nombre: 'biscote' }),
  a('tortitas_arroz', 'Tortitas de arroz', ['tortita de arroz', 'tortitas de arroz', 'tortitas de maiz'], 385, 8, 82, 3, { gramos: 9, nombre: 'tortita' }),
  a('tortitas', 'Tortitas / pancakes', ['tortitas', 'pancakes', 'tortitas de avena', 'crepes', 'crepe'], 230, 8, 30, 9, { gramos: 60, nombre: 'tortita' }),
  a('granola', 'Granola / muesli', ['granola', 'muesli'], 430, 10, 60, 16, { gramos: 40, nombre: 'racion' }),
  a('cuscus', 'Cuscus cocido', ['cuscus', 'cous cous', 'couscous', 'bulgur'], 112, 3.8, 23, 0.2, { gramos: 150, nombre: 'racion' }),
  a('fideos', 'Fideos / noodles cocidos', ['fideos', 'noodles', 'ramen', 'fideua'], 140, 4.5, 26, 2, { gramos: 200, nombre: 'plato' }),
  a('gnocchi', 'Gnocchi', ['gnocchi', 'noquis'], 150, 3.5, 32, 0.5, { gramos: 200, nombre: 'plato' }),
  a('pure_patata', 'Pure de patata', ['pure de patata', 'pure', 'pure de patatas'], 90, 2, 14, 3, { gramos: 200, nombre: 'racion' }),
  a('boniato_frito', 'Boniato frito', ['boniato frito', 'batata frita', 'patatas de boniato'], 190, 2, 30, 7, { gramos: 120, nombre: 'racion' }),
  a('empanada', 'Empanada / empanadilla', ['empanada', 'empanadilla', 'empanadillas'], 280, 9, 30, 14, { gramos: 100, nombre: 'racion' }),
  a('miel', 'Miel', ['miel'], 320, 0.3, 80, 0, { gramos: 15, nombre: 'cucharada' }),
  a('mermelada', 'Mermelada', ['mermelada', 'mermelada light'], 220, 0.3, 55, 0, { gramos: 20, nombre: 'cucharada' }),
  a('azucar', 'Azucar', ['azucar', 'sobre de azucar', 'terron'], 400, 0, 100, 0, { gramos: 6, nombre: 'cucharadita' }),
  a('cacao', 'Cacao en polvo (colacao)', ['cacao', 'colacao', 'cola cao', 'nesquik', 'cacao en polvo'], 380, 5, 80, 3, { gramos: 15, nombre: 'cucharada' }),
  a('cacao_puro', 'Cacao puro', ['cacao puro', 'cacao desgrasado'], 350, 22, 15, 12, { gramos: 10, nombre: 'cucharada' }),

  // ── Grasas, salsas y snacks ────────────────────────────────────────
  a('mayonesa', 'Mayonesa', ['mayonesa', 'alioli', 'ali oli', 'salsa cesar'], 700, 1, 2, 76, { gramos: 15, nombre: 'cucharada' }),
  a('mayonesa_light', 'Mayonesa light', ['mayonesa light', 'mayonesa ligera'], 300, 1, 8, 29, { gramos: 15, nombre: 'cucharada' }),
  a('ketchup', 'Ketchup / salsas', ['ketchup', 'salsa barbacoa', 'barbacoa', 'salsa de soja', 'mostaza'], 110, 1.5, 25, 0.3, { gramos: 15, nombre: 'cucharada' }),
  a('tomate_frito', 'Tomate frito', ['tomate frito', 'salsa de tomate', 'tomate triturado'], 75, 1.5, 9, 3.5, { gramos: 60, nombre: 'racion' }),
  a('pesto', 'Pesto', ['pesto', 'salsa pesto'], 450, 5, 6, 45, { gramos: 30, nombre: 'cucharada' }),
  a('nata', 'Nata / salsa de nata', ['nata', 'salsa carbonara', 'carbonara', 'nata para cocinar'], 200, 2.5, 4, 20, { gramos: 50, nombre: 'racion' }),
  a('aceite_coco', 'Aceite de coco / girasol', ['aceite de coco', 'aceite de girasol', 'aceite de sesamo'], 884, 0, 0, 100, { gramos: 10, nombre: 'cucharada' }),
  a('semillas', 'Semillas (chia, lino, sesamo)', ['semillas', 'chia', 'semillas de chia', 'lino', 'semillas de lino', 'sesamo', 'pipas de calabaza', 'pipas de girasol', 'pipas'], 500, 20, 15, 38, { gramos: 15, nombre: 'cucharada' }),
  a('anacardos', 'Anacardos / pistachos', ['anacardos', 'anacardo', 'pistachos', 'pistacho', 'avellanas', 'avellana', 'frutos secos', 'mix de frutos secos'], 590, 18, 25, 48, { gramos: 30, nombre: 'punado' }),
  a('cacahuetes', 'Cacahuetes', ['cacahuetes', 'cacahuete', 'mani'], 580, 26, 12, 48, { gramos: 30, nombre: 'punado' }),
  a('patatas_bolsa', 'Patatas de bolsa', ['patatas de bolsa', 'patatas fritas de bolsa', 'bolsa de patatas', 'doritos', 'nachos', 'snacks'], 530, 6, 50, 34, { gramos: 40, nombre: 'bolsa pequena' }),
  a('palomitas', 'Palomitas', ['palomitas', 'palomitas de maiz'], 400, 8, 55, 18, { gramos: 50, nombre: 'racion' }),
  a('chocolate_leche', 'Chocolate con leche', ['chocolate con leche', 'chocolate', 'kinder', 'bombones', 'bombon', 'chocolatina', 'kitkat', 'snickers', 'twix', 'mars'], 535, 7, 57, 30, { gramos: 25, nombre: 'onza' }),
  a('nocilla', 'Crema de cacao (nutella)', ['nocilla', 'nutella', 'crema de cacao'], 540, 6, 57, 31, { gramos: 20, nombre: 'cucharada' }),
  a('gominolas', 'Gominolas / chuches', ['gominolas', 'gominola', 'chuches', 'chucherias', 'haribo', 'regaliz'], 340, 6, 78, 0.2, { gramos: 30, nombre: 'punado' }),
  a('magdalena', 'Magdalena / bolleria', ['magdalena', 'magdalenas', 'muffin', 'donut', 'donuts', 'napolitana', 'bolleria', 'palmera', 'ensaimada', 'bizcocho'], 420, 6, 50, 22, { gramos: 60, nombre: 'unidad' }),
  a('cereales_barrita', 'Barrita de cereales', ['barrita de cereales', 'barritas de cereales'], 400, 6, 68, 12, { gramos: 25, nombre: 'barrita' }),
  a('natillas', 'Yogur de sabores / natillas', ['yogur de sabores', 'yogur de fresa', 'yogur azucarado', 'petit suisse', 'danonino', 'actimel'], 95, 3.5, 15, 2.5, { gramos: 125, nombre: 'unidad' }),

  // ── Mas platos ────────────────────────────────────────────────────
  a('arroz_pollo', 'Arroz con pollo / risotto', ['arroz con pollo', 'risotto', 'arroz tres delicias', 'arroz a la cubana', 'arroz al horno'], 160, 8, 22, 4.5, { gramos: 300, nombre: 'plato' }),
  a('pasta_bolonesa', 'Pasta bolonesa / macarrones con tomate', ['macarrones', 'espaguetis bolonesa', 'bolonesa', 'macarrones con tomate', 'macarrones con chorizo', 'espaguetis carbonara'], 165, 7, 22, 5.5, { gramos: 300, nombre: 'plato' }),
  a('ensaladilla', 'Ensaladilla rusa', ['ensaladilla', 'ensaladilla rusa'], 190, 5, 12, 14, { gramos: 150, nombre: 'racion' }),
  a('croquetas', 'Croquetas', ['croqueta', 'croquetas'], 250, 8, 22, 14, { gramos: 30, nombre: 'croqueta' }),
  a('kebab', 'Kebab / durum', ['kebab', 'durum', 'doner', 'shawarma'], 230, 12, 24, 10, { gramos: 350, nombre: 'kebab' }),
  a('tacos', 'Tacos / burrito', ['taco', 'tacos', 'burrito', 'fajitas', 'quesadilla'], 220, 11, 22, 10, { gramos: 200, nombre: 'racion' }),
  a('poke', 'Poke bowl', ['poke', 'poke bowl'], 150, 9, 18, 5, { gramos: 400, nombre: 'bol' }),
  a('ensalada_cesar', 'Ensalada cesar', ['ensalada cesar', 'cesar'], 140, 8, 6, 9, { gramos: 300, nombre: 'plato' }),
  a('ensalada_pollo', 'Ensalada con pollo', ['ensalada con pollo', 'ensalada de pollo', 'ensalada de atun', 'ensalada con atun', 'ensalada completa'], 110, 10, 4, 6, { gramos: 350, nombre: 'plato' }),
  a('wok', 'Wok / salteado con pollo', ['wok', 'salteado', 'salteado de pollo', 'pollo con verduras', 'pollo al curry', 'curry'], 130, 11, 9, 6, { gramos: 350, nombre: 'plato' }),
  a('lentejas_guiso', 'Lentejas guisadas', ['lentejas guisadas', 'plato de lentejas', 'potaje', 'garbanzos con espinacas', 'fabada', 'alubias con chorizo'], 130, 8, 16, 4, { gramos: 350, nombre: 'plato' }),
  a('tortilla_patatas_pincho', 'Pincho de tortilla', ['pincho de tortilla', 'pincho'], 200, 6, 14, 13, { gramos: 120, nombre: 'pincho' }),
  a('pizza_entera', 'Pizza entera mediana', ['pizza entera', 'pizza mediana', 'una pizza'], 270, 11, 33, 10, { gramos: 700, nombre: 'pizza' }),
  a('bocadillo_lomo', 'Bocadillo de lomo / pepito', ['bocadillo de lomo', 'pepito', 'bocadillo de jamon', 'bocadillo de tortilla', 'bocata'], 260, 13, 30, 10, { gramos: 250, nombre: 'bocadillo' }),
  a('sopa_fideos', 'Sopa de fideos / de pollo', ['sopa de fideos', 'sopa de pollo', 'sopa de verduras', 'consome'], 45, 2.5, 6, 1.2, { gramos: 300, nombre: 'plato' }),

  // ── Mas bebidas ───────────────────────────────────────────────────
  a('agua', 'Agua', ['agua', 'agua con gas', 'agua mineral'], 0, 0, 0, 0, { gramos: 250, nombre: 'vaso' }),
  a('te', 'Te / infusion', ['te', 'infusion', 'te verde', 'manzanilla', 'te con limon', 'poleo'], 1, 0, 0.2, 0, { gramos: 250, nombre: 'taza' }),
  a('kombucha', 'Kombucha', ['kombucha'], 20, 0, 5, 0, { gramos: 330, nombre: 'botella' }),
  a('zumo_envasado', 'Zumo envasado / nectar', ['zumo de fruta', 'zumo envasado', 'nectar', 'zumo de pina', 'zumo de manzana', 'zumo de melocoton'], 45, 0.3, 11, 0.1, { gramos: 200, nombre: 'vaso' }),
  a('batido_frutas', 'Batido de frutas / smoothie', ['smoothie', 'batido de frutas', 'batido de platano', 'batido de fresa'], 60, 1.5, 12, 0.8, { gramos: 300, nombre: 'vaso' }),
  a('cafe_bombon', 'Cafe bombon / con azucar', ['cafe bombon', 'cafe con azucar', 'cafe con leche y azucar', 'carajillo'], 80, 1.5, 14, 1.5, { gramos: 120, nombre: 'taza' }),
  a('leche_cacao', 'Vaso de leche con cacao', ['leche con cacao', 'leche con colacao', 'batido de cacao', 'batido de chocolate', 'cacaolat', 'puleva'], 75, 3.2, 11, 1.8, { gramos: 250, nombre: 'vaso' }),
  a('bebida_isotonica', 'Bebida isotonica', ['isotonica', 'bebida isotonica', 'powerade', 'gatorade', 'aquarius naranja'], 26, 0, 6.3, 0, { gramos: 500, nombre: 'botella' }),
  a('sidra', 'Sidra', ['sidra'], 45, 0, 4, 0, { gramos: 200, nombre: 'vaso' }, 0.35),
  a('tinto_verano', 'Tinto de verano / sangria', ['tinto de verano', 'sangria', 'calimocho', 'kalimotxo'], 55, 0, 7, 0, { gramos: 300, nombre: 'vaso' }, 0.3),
  a('vermut', 'Vermut / chupito', ['vermut', 'vermu', 'chupito', 'licor', 'orujo', 'whisky', 'ron', 'ginebra', 'vodka'], 200, 0, 8, 0, { gramos: 60, nombre: 'copa' }, 1.5),
  a('cerveza_00', 'Cerveza 0,0', ['cerveza 00', 'cerveza 0 0', 'cerveza 0', 'cerveza cero cero', 'cerveza sin alcohol 00'], 24, 0.4, 5, 0, { gramos: 330, nombre: 'tercio' }),
];

// ── Busqueda ─────────────────────────────────────────────────────────

export function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/ñ/g, 'n')
    .replace(/[^a-z0-9 ]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

const RELLENO = new Set(['de', 'del', 'la', 'el', 'los', 'las', 'con', 'un', 'una', 'unos', 'unas', 'y', 'a', 'al', 'en']);

function palabrasClave(texto: string): string[] {
  return normalizar(texto)
    .split(' ')
    .filter((p) => p && !RELLENO.has(p))
    .map((p) => (p.length > 4 && p.endsWith('s') ? p.slice(0, -1) : p)); // plural simple
}

/** Devuelve el alimento que mejor encaja con un nombre libre, o null. */
export function buscarAlimento(nombre: string): Alimento | null {
  const limpio = normalizar(nombre);
  if (!limpio) return null;

  // 1. Alias exacto (el mas fiable).
  for (const alimento of ALIMENTOS) {
    if (alimento.alias.some((al) => normalizar(al) === limpio) || normalizar(alimento.nombre) === limpio) {
      return alimento;
    }
  }

  // 2. Por palabras clave: gana el que mas palabras comparte, y a igualdad el alias mas largo.
  const claves = palabrasClave(nombre);
  if (!claves.length) return null;
  let mejor: { alimento: Alimento; puntos: number } | null = null;
  for (const alimento of ALIMENTOS) {
    for (const al of [alimento.nombre, ...alimento.alias]) {
      const suyas = palabrasClave(al);
      const comunes = suyas.filter((p) => claves.includes(p)).length;
      if (!comunes) continue;
      // Penaliza alias que piden palabras que el usuario no ha dicho ("atun en aceite" vs "atun").
      const puntos = comunes * 2 - (suyas.length - comunes);
      if (!mejor || puntos > mejor.puntos) mejor = { alimento, puntos };
    }
  }
  return mejor && mejor.puntos > 0 ? mejor.alimento : null;
}

// ── Parseo de una comida escrita ─────────────────────────────────────

export interface LineaComida {
  texto: string;
  alimento: Alimento | null;
  gramos: number;
  kcal: number;
  proteina: number;
  carbos: number;
  grasa: number;
  alcoholUd: number;
}

export interface ComidaCalculada {
  lineas: LineaComida[];
  kcal: number;
  proteina: number;
  carbos: number;
  grasa: number;
  alcoholUd: number;
  /** Lineas que no se han reconocido y no suman. */
  sinReconocer: string[];
  descripcion: string;
}

const UNIDADES_PESO = /^(g|gr|grs|gramos?|ml|mililitros?|cc)$/;
const UNIDADES_PORCION = /^(ud|uds|unidad(es)?|pieza[s]?|rebanada[s]?|loncha[s]?|cucharada[s]?|cucharadita[s]?|vaso[s]?|lata[s]?|copa[s]?|cana[s]?|tercio[s]?|punado[s]?|cazo[s]?|scoop[s]?|racion(es)?|plato[s]?|taza[s]?|bol(es)?|filete[s]?|huevo[s]?|onza[s]?|porcion(es)?|bola[s]?|tarrina[s]?|tostada[s]?|galleta[s]?)$/;
const NUMEROS_PALABRA: Record<string, number> = {
  un: 1, una: 1, uno: 1, dos: 2, tres: 3, cuatro: 4, cinco: 5, seis: 6, medio: 0.5, media: 0.5,
};

function cantidadDe(alimento: Alimento, numero: number | null, unidad: string | null): number {
  if (unidad && UNIDADES_PESO.test(unidad)) return numero ?? 100;
  const porcion = alimento.porcion?.gramos ?? 100;
  if (unidad && UNIDADES_PORCION.test(unidad)) return (numero ?? 1) * porcion;
  if (numero === null) return porcion;
  // Sin unidad: un numero pequeno son unidades ("2 huevos"), uno grande son gramos ("200 pollo").
  return numero <= 12 && alimento.porcion ? numero * porcion : numero;
}

function analizarSegmento(segmento: string): LineaComida {
  const limpio = normalizar(segmento);
  const tokens = limpio.split(' ').filter(Boolean);
  let numero: number | null = null;
  let unidad: string | null = null;
  const resto: string[] = [];

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    const numerico = t.replace(',', '.');
    if (numero === null && /^\d+([.,]\d+)?$/.test(numerico)) {
      numero = Number(numerico);
      continue;
    }
    if (numero === null && t in NUMEROS_PALABRA) {
      numero = NUMEROS_PALABRA[t];
      continue;
    }
    if (!unidad && (UNIDADES_PESO.test(t) || UNIDADES_PORCION.test(t))) {
      unidad = t;
      continue;
    }
    resto.push(t);
  }

  // "una lata de atun": la unidad sirve de pista pero el alimento es el resto.
  const nombre = resto.join(' ') || unidad || '';
  const alimento = buscarAlimento(nombre) ?? (unidad ? buscarAlimento(unidad) : null);
  if (!alimento) {
    return { texto: segmento.trim(), alimento: null, gramos: 0, kcal: 0, proteina: 0, carbos: 0, grasa: 0, alcoholUd: 0 };
  }

  const gramos = Math.max(0, cantidadDe(alimento, numero, unidad));
  const factor = gramos / 100;
  return {
    texto: segmento.trim(),
    alimento,
    gramos,
    kcal: Math.round(alimento.kcal * factor),
    proteina: Math.round(alimento.proteina * factor * 10) / 10,
    carbos: Math.round(alimento.carbos * factor * 10) / 10,
    grasa: Math.round(alimento.grasa * factor * 10) / 10,
    alcoholUd: alimento.alcoholPor100 ? Math.round(alimento.alcoholPor100 * factor * 10) / 10 : 0,
  };
}

/**
 * "200 g pollo, 150 arroz, 1 cucharada de aceite y un platano" → macros.
 * Separa por comas, saltos de linea, "+" o " y " y calcula cada parte.
 */
export function calcularComida(texto: string): ComidaCalculada {
  const segmentos = texto
    .split(/,|\n|\+|;| y /i)
    .map((s) => s.trim())
    // Se ignoran los trozos que son solo un numero ("cerveza 0,0" se parte en "cerveza 0" y "0").
    .filter((s) => s && !/^\d+$/.test(s));

  // "cafe con leche" es un alimento; "pollo con arroz" son dos. Se prueba entero
  // y, si no se reconoce, se parte por " con ".
  const lineas = segmentos.flatMap((segmento) => {
    const entera = analizarSegmento(segmento);
    if (entera.alimento || !/ con /i.test(segmento)) return [entera];
    return segmento.split(/ con /i).map((parte) => analizarSegmento(parte.trim()));
  });
  const reconocidas = lineas.filter((l) => l.alimento);
  const suma = (clave: 'kcal' | 'proteina' | 'carbos' | 'grasa' | 'alcoholUd') =>
    Math.round(reconocidas.reduce((total, l) => total + l[clave], 0) * 10) / 10;

  return {
    lineas,
    kcal: Math.round(suma('kcal')),
    proteina: suma('proteina'),
    carbos: suma('carbos'),
    grasa: suma('grasa'),
    alcoholUd: suma('alcoholUd'),
    sinReconocer: lineas.filter((l) => !l.alimento).map((l) => l.texto),
    descripcion: reconocidas.map((l) => `${l.gramos} g ${l.alimento!.nombre.toLowerCase()}`).join(', '),
  };
}
