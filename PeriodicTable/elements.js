// 元素データ
const elements = [
    { number: 1, symbol: "H", name: "水素", nameEn: "Hydrogen", mass: 1.008, category: "nonmetal", row: 1, col: 1, description: "宇宙で最も豊富な元素。水の構成要素。" },
    { number: 2, symbol: "He", name: "ヘリウム", nameEn: "Helium", mass: 4.003, category: "noble-gas", row: 1, col: 18, description: "不活性ガス。風船やダイビングに使用。" },
    { number: 3, symbol: "Li", name: "リチウム", nameEn: "Lithium", mass: 6.941, category: "alkali-metal", row: 2, col: 1, description: "最も軽い金属。電池に使用。" },
    { number: 4, symbol: "Be", name: "ベリリウム", nameEn: "Beryllium", mass: 9.012, category: "alkaline-earth", row: 2, col: 2, description: "軽くて硬い金属。X線窓に使用。" },
    { number: 5, symbol: "B", name: "ホウ素", nameEn: "Boron", mass: 10.81, category: "metalloid", row: 2, col: 13, description: "半金属。ガラスや洗剤に使用。" },
    { number: 6, symbol: "C", name: "炭素", nameEn: "Carbon", mass: 12.01, category: "nonmetal", row: 2, col: 14, description: "生命の基礎となる元素。ダイヤモンドや黒鉛の成分。" },
    { number: 7, symbol: "N", name: "窒素", nameEn: "Nitrogen", mass: 14.01, category: "nonmetal", row: 2, col: 15, description: "大気の約78%を占める。肥料の原料。" },
    { number: 8, symbol: "O", name: "酸素", nameEn: "Oxygen", mass: 16.00, category: "nonmetal", row: 2, col: 16, description: "呼吸に不可欠。大気の約21%を占める。" },
    { number: 9, symbol: "F", name: "フッ素", nameEn: "Fluorine", mass: 19.00, category: "halogen", row: 2, col: 17, description: "最も反応性の高い元素。歯磨き粉に使用。" },
    { number: 10, symbol: "Ne", name: "ネオン", nameEn: "Neon", mass: 20.18, category: "noble-gas", row: 2, col: 18, description: "不活性ガス。ネオンサインに使用。" },
    { number: 11, symbol: "Na", name: "ナトリウム", nameEn: "Sodium", mass: 22.99, category: "alkali-metal", row: 3, col: 1, description: "柔らかい金属。食塩の成分。" },
    { number: 12, symbol: "Mg", name: "マグネシウム", nameEn: "Magnesium", mass: 24.31, category: "alkaline-earth", row: 3, col: 2, description: "軽い金属。骨の形成に重要。" },
    { number: 13, symbol: "Al", name: "アルミニウム", nameEn: "Aluminum", mass: 26.98, category: "post-transition", row: 3, col: 13, description: "軽くて丈夫な金属。缶や箔に使用。" },
    { number: 14, symbol: "Si", name: "ケイ素", nameEn: "Silicon", mass: 28.09, category: "metalloid", row: 3, col: 14, description: "半導体の主成分。コンピュータチップに使用。" },
    { number: 15, symbol: "P", name: "リン", nameEn: "Phosphorus", mass: 30.97, category: "nonmetal", row: 3, col: 15, description: "DNA、ATPの構成要素。マッチに使用。" },
    { number: 16, symbol: "S", name: "硫黄", nameEn: "Sulfur", mass: 32.07, category: "nonmetal", row: 3, col: 16, description: "火山地帯に存在。ゴムの加硫に使用。" },
    { number: 17, symbol: "Cl", name: "塩素", nameEn: "Chlorine", mass: 35.45, category: "halogen", row: 3, col: 17, description: "消毒剤として使用。食塩の成分。" },
    { number: 18, symbol: "Ar", name: "アルゴン", nameEn: "Argon", mass: 39.95, category: "noble-gas", row: 3, col: 18, description: "大気の約0.93%を占める。溶接に使用。" },
    { number: 19, symbol: "K", name: "カリウム", nameEn: "Potassium", mass: 39.10, category: "alkali-metal", row: 4, col: 1, description: "神経や筋肉の機能に重要。バナナに豊富。" },
    { number: 20, symbol: "Ca", name: "カルシウム", nameEn: "Calcium", mass: 40.08, category: "alkaline-earth", row: 4, col: 2, description: "骨と歯の主成分。乳製品に豊富。" },
    { number: 21, symbol: "Sc", name: "スカンジウム", nameEn: "Scandium", mass: 44.96, category: "transition-metal", row: 4, col: 3, description: "軽い遷移金属。アルミ合金に使用。" },
    { number: 22, symbol: "Ti", name: "チタン", nameEn: "Titanium", mass: 47.87, category: "transition-metal", row: 4, col: 4, description: "軽くて強い金属。航空機や人工関節に使用。" },
    { number: 23, symbol: "V", name: "バナジウム", nameEn: "Vanadium", mass: 50.94, category: "transition-metal", row: 4, col: 5, description: "鋼鉄の強化に使用。工具鋼の成分。" },
    { number: 24, symbol: "Cr", name: "クロム", nameEn: "Chromium", mass: 52.00, category: "transition-metal", row: 4, col: 6, description: "光沢のある金属。めっきやステンレス鋼に使用。" },
    { number: 25, symbol: "Mn", name: "マンガン", nameEn: "Manganese", mass: 54.94, category: "transition-metal", row: 4, col: 7, description: "電池や鋼鉄製造に使用。" },
    { number: 26, symbol: "Fe", name: "鉄", nameEn: "Iron", mass: 55.85, category: "transition-metal", row: 4, col: 8, description: "最も使用される金属。血液中のヘモグロビンに含まれる。" },
    { number: 27, symbol: "Co", name: "コバルト", nameEn: "Cobalt", mass: 58.93, category: "transition-metal", row: 4, col: 9, description: "青い顔料。リチウムイオン電池に使用。" },
    { number: 28, symbol: "Ni", name: "ニッケル", nameEn: "Nickel", mass: 58.69, category: "transition-metal", row: 4, col: 10, description: "腐食に強い金属。硬貨やステンレス鋼に使用。" },
    { number: 29, symbol: "Cu", name: "銅", nameEn: "Copper", mass: 63.55, category: "transition-metal", row: 4, col: 11, description: "電気伝導性が高い。配線や硬貨に使用。" },
    { number: 30, symbol: "Zn", name: "亜鉛", nameEn: "Zinc", mass: 65.38, category: "transition-metal", row: 4, col: 12, description: "腐食防止に使用。サプリメントとしても重要。" },
    { number: 31, symbol: "Ga", name: "ガリウム", nameEn: "Gallium", mass: 69.72, category: "post-transition", row: 4, col: 13, description: "低融点金属。LEDや半導体に使用。" },
    { number: 32, symbol: "Ge", name: "ゲルマニウム", nameEn: "Germanium", mass: 72.63, category: "metalloid", row: 4, col: 14, description: "半導体。光ファイバーや赤外線光学に使用。" },
    { number: 33, symbol: "As", name: "ヒ素", nameEn: "Arsenic", mass: 74.92, category: "metalloid", row: 4, col: 15, description: "半金属。半導体や木材防腐剤に使用。" },
    { number: 34, symbol: "Se", name: "セレン", nameEn: "Selenium", mass: 78.97, category: "nonmetal", row: 4, col: 16, description: "必須微量元素。太陽電池に使用。" },
    { number: 35, symbol: "Br", name: "臭素", nameEn: "Bromine", mass: 79.90, category: "halogen", row: 4, col: 17, description: "常温で液体のハロゲン。難燃剤に使用。" },
    { number: 36, symbol: "Kr", name: "クリプトン", nameEn: "Krypton", mass: 83.80, category: "noble-gas", row: 4, col: 18, description: "不活性ガス。照明や写真フラッシュに使用。" },
    { number: 37, symbol: "Rb", name: "ルビジウム", nameEn: "Rubidium", mass: 85.47, category: "alkali-metal", row: 5, col: 1, description: "非常に反応性の高い金属。原子時計に使用。" },
    { number: 38, symbol: "Sr", name: "ストロンチウム", nameEn: "Strontium", mass: 87.62, category: "alkaline-earth", row: 5, col: 2, description: "花火の赤色に使用。" },
    { number: 39, symbol: "Y", name: "イットリウム", nameEn: "Yttrium", mass: 88.91, category: "transition-metal", row: 5, col: 3, description: "赤色蛍光体。LEDやレーザーに使用。" },
    { number: 40, symbol: "Zr", name: "ジルコニウム", nameEn: "Zirconium", mass: 91.22, category: "transition-metal", row: 5, col: 4, description: "耐熱性金属。原子炉の被覆材に使用。" },
    { number: 41, symbol: "Nb", name: "ニオブ", nameEn: "Niobium", mass: 92.91, category: "transition-metal", row: 5, col: 5, description: "超伝導体。MRIの磁石に使用。" },
    { number: 42, symbol: "Mo", name: "モリブデン", nameEn: "Molybdenum", mass: 95.95, category: "transition-metal", row: 5, col: 6, description: "高温に強い金属。鋼鉄の強化に使用。" },
    { number: 43, symbol: "Tc", name: "テクネチウム", nameEn: "Technetium", mass: 98, category: "transition-metal", row: 5, col: 7, description: "最初の人工元素。医療診断に使用。" },
    { number: 44, symbol: "Ru", name: "ルテニウム", nameEn: "Ruthenium", mass: 101.1, category: "transition-metal", row: 5, col: 8, description: "耐摩耗性合金。電気接点に使用。" },
    { number: 45, symbol: "Rh", name: "ロジウム", nameEn: "Rhodium", mass: 102.9, category: "transition-metal", row: 5, col: 9, description: "触媒コンバータに使用。非常に高価。" },
    { number: 46, symbol: "Pd", name: "パラジウム", nameEn: "Palladium", mass: 106.4, category: "transition-metal", row: 5, col: 10, description: "触媒。自動車の排気ガス浄化に使用。" },
    { number: 47, symbol: "Ag", name: "銀", nameEn: "Silver", mass: 107.9, category: "transition-metal", row: 5, col: 11, description: "最も電気伝導性が高い金属。宝飾品や写真に使用。" },
    { number: 48, symbol: "Cd", name: "カドミウム", nameEn: "Cadmium", mass: 112.4, category: "transition-metal", row: 5, col: 12, description: "電池や顔料に使用。有毒。" },
    { number: 49, symbol: "In", name: "インジウム", nameEn: "Indium", mass: 114.8, category: "post-transition", row: 5, col: 13, description: "液晶ディスプレイのITO膜に使用。" },
    { number: 50, symbol: "Sn", name: "スズ", nameEn: "Tin", mass: 118.7, category: "post-transition", row: 5, col: 14, description: "缶詰のめっき。はんだに使用。" },
    { number: 51, symbol: "Sb", name: "アンチモン", nameEn: "Antimony", mass: 121.8, category: "metalloid", row: 5, col: 15, description: "難燃剤や蓄電池に使用。" },
    { number: 52, symbol: "Te", name: "テルル", nameEn: "Tellurium", mass: 127.6, category: "metalloid", row: 5, col: 16, description: "太陽電池や熱電素子に使用。" },
    { number: 53, symbol: "I", name: "ヨウ素", nameEn: "Iodine", mass: 126.9, category: "halogen", row: 5, col: 17, description: "甲状腺ホルモンに必要。消毒剤として使用。" },
    { number: 54, symbol: "Xe", name: "キセノン", nameEn: "Xenon", mass: 131.3, category: "noble-gas", row: 5, col: 18, description: "不活性ガス。照明や麻酔に使用。" },
    { number: 55, symbol: "Cs", name: "セシウム", nameEn: "Cesium", mass: 132.9, category: "alkali-metal", row: 6, col: 1, description: "最も電気陽性な金属。原子時計に使用。" },
    { number: 56, symbol: "Ba", name: "バリウム", nameEn: "Barium", mass: 137.3, category: "alkaline-earth", row: 6, col: 2, description: "X線造影剤。花火の緑色に使用。" },
    { number: 57, symbol: "La", name: "ランタン", nameEn: "Lanthanum", mass: 138.9, category: "lanthanide", row: 9, col: 3, description: "ランタノイドの最初の元素。触媒に使用。" },
    { number: 58, symbol: "Ce", name: "セリウム", nameEn: "Cerium", mass: 140.1, category: "lanthanide", row: 9, col: 4, description: "最も豊富なレアアース。研磨剤に使用。" },
    { number: 59, symbol: "Pr", name: "プラセオジム", nameEn: "Praseodymium", mass: 140.9, category: "lanthanide", row: 9, col: 5, description: "緑色のガラスや磁石に使用。" },
    { number: 60, symbol: "Nd", name: "ネオジム", nameEn: "Neodymium", mass: 144.2, category: "lanthanide", row: 9, col: 6, description: "強力な磁石の製造に使用。" },
    { number: 61, symbol: "Pm", name: "プロメチウム", nameEn: "Promethium", mass: 145, category: "lanthanide", row: 9, col: 7, description: "放射性元素。夜光塗料に使用されていた。" },
    { number: 62, symbol: "Sm", name: "サマリウム", nameEn: "Samarium", mass: 150.4, category: "lanthanide", row: 9, col: 8, description: "磁石やがん治療に使用。" },
    { number: 63, symbol: "Eu", name: "ユウロピウム", nameEn: "Europium", mass: 152.0, category: "lanthanide", row: 9, col: 9, description: "赤色蛍光体。ユーロ紙幣の偽造防止に使用。" },
    { number: 64, symbol: "Gd", name: "ガドリニウム", nameEn: "Gadolinium", mass: 157.3, category: "lanthanide", row: 9, col: 10, description: "MRI造影剤に使用。" },
    { number: 65, symbol: "Tb", name: "テルビウム", nameEn: "Terbium", mass: 158.9, category: "lanthanide", row: 9, col: 11, description: "緑色蛍光体。固体照明に使用。" },
    { number: 66, symbol: "Dy", name: "ジスプロシウム", nameEn: "Dysprosium", mass: 162.5, category: "lanthanide", row: 9, col: 12, description: "磁石の性能向上に使用。" },
    { number: 67, symbol: "Ho", name: "ホルミウム", nameEn: "Holmium", mass: 164.9, category: "lanthanide", row: 9, col: 13, description: "レーザーや磁気装置に使用。" },
    { number: 68, symbol: "Er", name: "エルビウム", nameEn: "Erbium", mass: 167.3, category: "lanthanide", row: 9, col: 14, description: "光ファイバー増幅器に使用。" },
    { number: 69, symbol: "Tm", name: "ツリウム", nameEn: "Thulium", mass: 168.9, category: "lanthanide", row: 9, col: 15, description: "最も希少なランタノイド。医療用X線に使用。" },
    { number: 70, symbol: "Yb", name: "イッテルビウム", nameEn: "Ytterbium", mass: 173.0, category: "lanthanide", row: 9, col: 16, description: "レーザーや原子時計に使用。" },
    { number: 71, symbol: "Lu", name: "ルテチウム", nameEn: "Lutetium", mass: 175.0, category: "lanthanide", row: 9, col: 17, description: "PET触媒やがん治療に使用。" },
    { number: 72, symbol: "Hf", name: "ハフニウム", nameEn: "Hafnium", mass: 178.5, category: "transition-metal", row: 6, col: 4, description: "原子炉の制御棒に使用。" },
    { number: 73, symbol: "Ta", name: "タンタル", nameEn: "Tantalum", mass: 180.9, category: "transition-metal", row: 6, col: 5, description: "電子部品のコンデンサに使用。" },
    { number: 74, symbol: "W", name: "タングステン", nameEn: "Tungsten", mass: 183.8, category: "transition-metal", row: 6, col: 6, description: "最も融点が高い金属。電球のフィラメントに使用。" },
    { number: 75, symbol: "Re", name: "レニウム", nameEn: "Rhenium", mass: 186.2, category: "transition-metal", row: 6, col: 7, description: "高温合金。ジェットエンジンに使用。" },
    { number: 76, symbol: "Os", name: "オスミウム", nameEn: "Osmium", mass: 190.2, category: "transition-metal", row: 6, col: 8, description: "最も密度が高い元素。硬い合金に使用。" },
    { number: 77, symbol: "Ir", name: "イリジウム", nameEn: "Iridium", mass: 192.2, category: "transition-metal", row: 6, col: 9, description: "腐食に非常に強い。点火プラグに使用。" },
    { number: 78, symbol: "Pt", name: "白金", nameEn: "Platinum", mass: 195.1, category: "transition-metal", row: 6, col: 10, description: "貴金属。触媒や宝飾品に使用。" },
    { number: 79, symbol: "Au", name: "金", nameEn: "Gold", mass: 197.0, category: "transition-metal", row: 6, col: 11, description: "腐食しない貴金属。宝飾品や電子部品に使用。" },
    { number: 80, symbol: "Hg", name: "水銀", nameEn: "Mercury", mass: 200.6, category: "transition-metal", row: 6, col: 12, description: "常温で液体の金属。温度計に使用されていた。" },
    { number: 81, symbol: "Tl", name: "タリウム", nameEn: "Thallium", mass: 204.4, category: "post-transition", row: 6, col: 13, description: "有毒な金属。超伝導体に使用。" },
    { number: 82, symbol: "Pb", name: "鉛", nameEn: "Lead", mass: 207.2, category: "post-transition", row: 6, col: 14, description: "放射線遮蔽材。蓄電池に使用。" },
    { number: 83, symbol: "Bi", name: "ビスマス", nameEn: "Bismuth", mass: 209.0, category: "post-transition", row: 6, col: 15, description: "虹色の結晶を形成。医薬品に使用。" },
    { number: 84, symbol: "Po", name: "ポロニウム", nameEn: "Polonium", mass: 209, category: "metalloid", row: 6, col: 16, description: "放射性元素。静電気除去装置に使用。" },
    { number: 85, symbol: "At", name: "アスタチン", nameEn: "Astatine", mass: 210, category: "halogen", row: 6, col: 17, description: "最も希少な天然元素。がん治療の研究に使用。" },
    { number: 86, symbol: "Rn", name: "ラドン", nameEn: "Radon", mass: 222, category: "noble-gas", row: 6, col: 18, description: "放射性ガス。地下に蓄積することがある。" },
    { number: 87, symbol: "Fr", name: "フランシウム", nameEn: "Francium", mass: 223, category: "alkali-metal", row: 7, col: 1, description: "最も不安定なアルカリ金属。研究用のみ。" },
    { number: 88, symbol: "Ra", name: "ラジウム", nameEn: "Radium", mass: 226, category: "alkaline-earth", row: 7, col: 2, description: "放射性元素。かつては発光塗料に使用。" },
    { number: 89, symbol: "Ac", name: "アクチニウム", nameEn: "Actinium", mass: 227, category: "actinide", row: 10, col: 3, description: "アクチノイドの最初の元素。がん治療の研究に使用。" },
    { number: 90, symbol: "Th", name: "トリウム", nameEn: "Thorium", mass: 232.0, category: "actinide", row: 10, col: 4, description: "原子力燃料の候補。キャンプ用ランタンに使用。" },
    { number: 91, symbol: "Pa", name: "プロトアクチニウム", nameEn: "Protactinium", mass: 231.0, category: "actinide", row: 10, col: 5, description: "非常に希少で放射性が高い。研究用のみ。" },
    { number: 92, symbol: "U", name: "ウラン", nameEn: "Uranium", mass: 238.0, category: "actinide", row: 10, col: 6, description: "原子力発電の燃料。核兵器にも使用。" },
    { number: 93, symbol: "Np", name: "ネプツニウム", nameEn: "Neptunium", mass: 237, category: "actinide", row: 10, col: 7, description: "プルトニウム生産の副産物。" },
    { number: 94, symbol: "Pu", name: "プルトニウム", nameEn: "Plutonium", mass: 244, category: "actinide", row: 10, col: 8, description: "原子力発電と核兵器に使用。" },
    { number: 95, symbol: "Am", name: "アメリシウム", nameEn: "Americium", mass: 243, category: "actinide", row: 10, col: 9, description: "煙感知器に使用。" },
    { number: 96, symbol: "Cm", name: "キュリウム", nameEn: "Curium", mass: 247, category: "actinide", row: 10, col: 10, description: "宇宙探査機の電源に使用。" },
    { number: 97, symbol: "Bk", name: "バークリウム", nameEn: "Berkelium", mass: 247, category: "actinide", row: 10, col: 11, description: "科学研究用のみ。" },
    { number: 98, symbol: "Cf", name: "カリホルニウム", nameEn: "Californium", mass: 251, category: "actinide", row: 10, col: 12, description: "中性子源。金属探知や油井掘削に使用。" },
    { number: 99, symbol: "Es", name: "アインスタイニウム", nameEn: "Einsteinium", mass: 252, category: "actinide", row: 10, col: 13, description: "核爆発で発見された元素。" },
    { number: 100, symbol: "Fm", name: "フェルミウム", nameEn: "Fermium", mass: 257, category: "actinide", row: 10, col: 14, description: "核爆発で発見された元素。" },
    { number: 101, symbol: "Md", name: "メンデレビウム", nameEn: "Mendelevium", mass: 258, category: "actinide", row: 10, col: 15, description: "研究室でのみ合成される。" },
    { number: 102, symbol: "No", name: "ノーベリウム", nameEn: "Nobelium", mass: 259, category: "actinide", row: 10, col: 16, description: "研究室でのみ合成される。" },
    { number: 103, symbol: "Lr", name: "ローレンシウム", nameEn: "Lawrencium", mass: 266, category: "actinide", row: 10, col: 17, description: "アクチノイドの最後の元素。" },
    { number: 104, symbol: "Rf", name: "ラザホージウム", nameEn: "Rutherfordium", mass: 267, category: "transition-metal", row: 7, col: 4, description: "超重元素。研究目的のみ。" },
    { number: 105, symbol: "Db", name: "ドブニウム", nameEn: "Dubnium", mass: 268, category: "transition-metal", row: 7, col: 5, description: "超重元素。研究目的のみ。" },
    { number: 106, symbol: "Sg", name: "シーボーギウム", nameEn: "Seaborgium", mass: 269, category: "transition-metal", row: 7, col: 6, description: "超重元素。研究目的のみ。" },
    { number: 107, symbol: "Bh", name: "ボーリウム", nameEn: "Bohrium", mass: 270, category: "transition-metal", row: 7, col: 7, description: "超重元素。研究目的のみ。" },
    { number: 108, symbol: "Hs", name: "ハッシウム", nameEn: "Hassium", mass: 277, category: "transition-metal", row: 7, col: 8, description: "超重元素。研究目的のみ。" },
    { number: 109, symbol: "Mt", name: "マイトネリウム", nameEn: "Meitnerium", mass: 278, category: "unknown", row: 7, col: 9, description: "超重元素。研究目的のみ。" },
    { number: 110, symbol: "Ds", name: "ダームスタチウム", nameEn: "Darmstadtium", mass: 281, category: "unknown", row: 7, col: 10, description: "超重元素。研究目的のみ。" },
    { number: 111, symbol: "Rg", name: "レントゲニウム", nameEn: "Roentgenium", mass: 282, category: "unknown", row: 7, col: 11, description: "超重元素。研究目的のみ。" },
    { number: 112, symbol: "Cn", name: "コペルニシウム", nameEn: "Copernicium", mass: 285, category: "transition-metal", row: 7, col: 12, description: "超重元素。研究目的のみ。" },
    { number: 113, symbol: "Nh", name: "ニホニウム", nameEn: "Nihonium", mass: 286, category: "unknown", row: 7, col: 13, description: "日本で発見された元素。" },
    { number: 114, symbol: "Fl", name: "フレロビウム", nameEn: "Flerovium", mass: 289, category: "unknown", row: 7, col: 14, description: "超重元素。研究目的のみ。" },
    { number: 115, symbol: "Mc", name: "モスコビウム", nameEn: "Moscovium", mass: 290, category: "unknown", row: 7, col: 15, description: "超重元素。研究目的のみ。" },
    { number: 116, symbol: "Lv", name: "リバモリウム", nameEn: "Livermorium", mass: 293, category: "unknown", row: 7, col: 16, description: "超重元素。研究目的のみ。" },
    { number: 117, symbol: "Ts", name: "テネシン", nameEn: "Tennessine", mass: 294, category: "unknown", row: 7, col: 17, description: "超重元素。研究目的のみ。" },
    { number: 118, symbol: "Og", name: "オガネソン", nameEn: "Oganesson", mass: 294, category: "unknown", row: 7, col: 18, description: "周期表で最も重い元素。" }
];

// カテゴリー名の日本語マッピング
const categoryNames = {
    "alkali-metal": "アルカリ金属",
    "alkaline-earth": "アルカリ土類金属",
    "transition-metal": "遷移金属",
    "post-transition": "卑金属",
    "metalloid": "半金属",
    "nonmetal": "非金属",
    "halogen": "ハロゲン",
    "noble-gas": "希ガス",
    "lanthanide": "ランタノイド",
    "actinide": "アクチノイド",
    "unknown": "未分類"
};

// クイズ問題の種類
const quizTypes = [
    {
        type: "symbolToName",
        question: (e) => `元素記号「${e.symbol}」の元素名は？`,
        answer: (e) => e.name,
        options: (e, all) => generateOptions(e, all, el => el.name)
    },
    {
        type: "nameToSymbol",
        question: (e) => `「${e.name}」の元素記号は？`,
        answer: (e) => e.symbol,
        options: (e, all) => generateOptions(e, all, el => el.symbol)
    },
    {
        type: "numberToSymbol",
        question: (e) => `原子番号${e.number}の元素記号は？`,
        answer: (e) => e.symbol,
        options: (e, all) => generateOptions(e, all, el => el.symbol)
    },
    {
        type: "symbolToNumber",
        question: (e) => `元素記号「${e.symbol}」の原子番号は？`,
        answer: (e) => e.number.toString(),
        options: (e, all) => generateNumberOptions(e, all)
    },
    {
        type: "categoryQuestion",
        question: (e) => `「${e.name}（${e.symbol}）」はどのカテゴリーに属する？`,
        answer: (e) => categoryNames[e.category],
        options: (e, all) => generateCategoryOptions(e)
    }
];

// オプション生成関数
function generateOptions(element, allElements, getter) {
    const correctAnswer = getter(element);
    const options = [correctAnswer];
    const otherElements = allElements.filter(e => getter(e) !== correctAnswer);
    
    while (options.length < 4 && otherElements.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherElements.length);
        const randomOption = getter(otherElements[randomIndex]);
        if (!options.includes(randomOption)) {
            options.push(randomOption);
            otherElements.splice(randomIndex, 1);
        }
    }
    
    return shuffleArray(options);
}

function generateNumberOptions(element, allElements) {
    const correctAnswer = element.number;
    const options = [correctAnswer.toString()];
    
    // 近い番号を含める
    const nearNumbers = [
        correctAnswer - 1,
        correctAnswer + 1,
        correctAnswer - 10,
        correctAnswer + 10
    ].filter(n => n >= 1 && n <= 118 && n !== correctAnswer);
    
    while (options.length < 4 && nearNumbers.length > 0) {
        const randomIndex = Math.floor(Math.random() * nearNumbers.length);
        options.push(nearNumbers[randomIndex].toString());
        nearNumbers.splice(randomIndex, 1);
    }
    
    // まだ足りない場合はランダムに追加
    while (options.length < 4) {
        const randomNum = Math.floor(Math.random() * 118) + 1;
        if (!options.includes(randomNum.toString())) {
            options.push(randomNum.toString());
        }
    }
    
    return shuffleArray(options);
}

function generateCategoryOptions(element) {
    const correctAnswer = categoryNames[element.category];
    const allCategories = Object.values(categoryNames);
    const options = [correctAnswer];
    
    const otherCategories = allCategories.filter(c => c !== correctAnswer);
    
    while (options.length < 4 && otherCategories.length > 0) {
        const randomIndex = Math.floor(Math.random() * otherCategories.length);
        options.push(otherCategories[randomIndex]);
        otherCategories.splice(randomIndex, 1);
    }
    
    return shuffleArray(options);
}

// 配列をシャッフル
export function shuffleArray(array) {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
}

// エクスポート
export { elements, categoryNames, quizTypes };
