export type Category = { key: string; name: string; path: string; description: string; parent?: string; tags?: string[] };
export const categories: Category[] = [
  {key:"yasam",name:"Yaşam",path:"/konu/yasam/",description:"İyi hissettiren fikirler, yeni keşifler ve hayatın güzel detayları.",tags:["wellness","seyahat","dekorasyon","gastronomi","teknoloji","saglik","iliskiler","astroloji","tasarim"]},
  {key:"saglik",name:"Sağlık",path:"/saglikli-yasam,beslenme-ve-diyet,aile,psikoloji",description:"Beden, zihin ve gündelik yaşam üzerine.",parent:"yasam"},
  {key:"wellness",name:"Wellness",path:"/konu/wellness/",description:"Kendine döndüğün, iyi hissetmeye yer açtığın anlar.",parent:"yasam"},
  {key:"moda",name:"Moda & Stil",path:"/konu/moda/",description:"Podyumdan sokağa, stilin kendini ifade ettiği her yere.",tags:["moda","tasarim"]},
  {key:"tasarim",name:"Tasarım",path:"/konu/yasam/tasarim/",description:"Objelerin, mekânların ve fikirlerin arkasındaki yaratıcılık.",parent:"yasam"},
  {key:"teknoloji",name:"Teknoloji",path:"/konu/yasam/teknoloji/",description:"Dijital kültür, yeni fikirler ve hayatı değiştiren teknolojiler.",parent:"yasam"},
  {key:"dekorasyon",name:"Dekorasyon",path:"/konu/yasam/dekorasyon/",description:"Karakterli evler, ilham veren köşeler, küçük dokunuşlar.",parent:"yasam"},
  {key:"gastronomi",name:"Gastronomi",path:"/konu/yasam/yemek/",description:"Sofranın etrafında buluşan tatlar, insanlar ve hikâyeler.",parent:"yasam"},
  {key:"seyahat",name:"Seyahat",path:"/konu/yasam/seyahat/",description:"Yeni rotalar, yerel hikâyeler ve yola çıkmak için güzel nedenler.",parent:"yasam"},
  {key:"astroloji",name:"Astroloji",path:"/astroloji,astroloji-gundemi,burclar",description:"Gökyüzüne meraklı bir bakış.",parent:"yasam"},
  {key:"iliskiler",name:"Seks & İlişkiler",path:"/seks-iliskiler,seks,iliskiler/",description:"Birlikte olmanın, kendin kalmanın ve bağ kurmanın farklı halleri.",parent:"yasam"},
  {key:"ajanda",name:"Kültür & Sanat",path:"/konu/ajanda/",description:"İzle, dinle, oku. Hayata başka bir yerden bak.",tags:["dizi","sinema","muzik","sanat","mekan"]},
  {key:"dizi",name:"Dizi & TV",path:"/konu/ajanda/dizi-tv/",description:"Ekranın önünden ve arkasından hikâyeler.",parent:"ajanda"},
  {key:"sinema",name:"Sinema",path:"/konu/ajanda/sinema/",description:"Beyazperdenin içinden, sinemanın peşinden.",parent:"ajanda"},
  {key:"muzik",name:"Müzik",path:"/konu/ajanda/muzik/",description:"Kulaklığında, sahnede, hayatın ritminde.",parent:"ajanda"},
  {key:"sanat",name:"Sanat",path:"/konu/ajanda/sanat/",description:"Yeni karşılaşmalar ve bakış açını değiştiren işler.",parent:"ajanda"},
  {key:"mekan",name:"Mekân",path:"/konu/ajanda/mekan/",description:"Şehri yeniden keşfetmek için duraklar.",parent:"ajanda"},
  {key:"populer",name:"Popüler",path:"/konu/populer/",description:"Konuşulan isimler, yükselen fikirler ve kültürün nabzı.",tags:["gundem","celebrity","spor","business","sosyal"]},
  {key:"gundem",name:"Gündem",path:"/konu/populer/gundem/",description:"Hayatın içinden gündeme düşenler.",parent:"populer"},
  {key:"celebrity",name:"Celebrity",path:"/konu/populer/celebrity/",description:"İlham veren isimler, sahnenin arkası ve stil sahibi hikâyeler.",parent:"populer"},
  {key:"spor",name:"Spor",path:"/konu/populer/spor/",description:"Oyunun, hareketin ve tutkunun hikâyeleri.",parent:"populer"},
  {key:"business",name:"İş & Kariyer",path:"/konu/populer/business/",description:"İş hayatı, yaratıcı fikirler ve yeni başlangıçlar.",parent:"populer"},
  {key:"sosyal",name:"Sosyal Medya",path:"/konu/populer/sosyal-medya/",description:"İnternet kültürünün konuşulanları.",parent:"populer"},
];
export const categoryByKey = (key:string) => categories.find(c=>c.key===key)!;
export const mainNav = ["celebrity","moda","ajanda","yasam","wellness","seyahat","populer"].map(categoryByKey);
