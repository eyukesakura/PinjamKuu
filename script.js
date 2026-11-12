let barang = [
  {id:1, nama:"Proyektor Epson", stok:3, img:"assets/proyektor.jpg", kat:"Elektronik"},
  {id:2, nama:"Speaker Portable", stok:5, img:"assets/speaker.jpg", kat:"Elektronik"},
  {id:3, nama:"Laptop Legion", stok:2, img:"assets/laptop.jpg", kat:"Elektronik"},
  {id:4, nama:"Bola Voli", stok:4, img:"assets/bola-voli.jpg", kat:"Olahraga"},
  {id:5, nama:"Kamera Canon EOS", stok:1, img:"assets/kamera.jpg", kat:"Elektronik"},
  {id:6, nama:"Tripod HP", stok:6, img:"assets/tripod.jpg", kat:"Elektronik"},
  {id:7, nama:"Smart TV Interaktif", stok:1, img:"assets/smart-tv.jpg", kat:"Elektronik"},
  {id:8, nama:"Mic Wireless", stok:3, img:"assets/mic.jpg", kat:"Elektronik"},
  {id:9, nama:"Buku Pelajaran", stok:10, img:"assets/buku.jpg", kat:"Belajar"},
  {id:10, nama:"Printer HP LaserJet", stok:2, img:"assets/printer.jpg", kat:"Elektronik"},
  {id:11, nama:"Gitar Akustik Yamaha", stok:4, img:"assets/gitar.jpg", kat:"Musik"},
];

let filterAktif = "Semua";

function tampilBarang(cari=""){
  let list = document.getElementById("listBarang");
  list.innerHTML = "";
  let pilih = document.getElementById("pilihBarang");
  pilih.innerHTML = "";
  let totalStok = barang.reduce((a,b)=>a+b.stok,0);
  document.getElementById("statStok").textContent = totalStok;
  document.getElementById("statTotal").textContent = barang.length;

  barang.filter(b => (filterAktif==="Semua" || b.kat===filterAktif) && b.nama.toLowerCase().includes(cari.toLowerCase())).forEach(b=>{
    list.innerHTML += `
    <div class="col-12 col-md-4 mb-3">
      <div class="card h-100">
        <div style="position:relative">
          <span class="badge-kategori cat-${b.kat}">${b.kat}</span>
          <img src="${b.img}" class="card-img-top" onerror="if(!this.dataset.coba){this.dataset.coba=1; this.src=this.src.replace('.jpg','.jpeg')} else if(this.dataset.coba==1){this.dataset.coba=2; this.src=this.src.replace('.jpeg','.png')} else {this.style.display='none'}">
        </div>
        <div class="card-body">
          <h5 class="fw-bold mb-1">${b.nama}</h5>
          <span class="stok-badge">● Stok: ${b.stok} Tersedia</span>
          <div class="d-flex gap-2 mt-3">
            <button class="btn btn-primary btn-sm btn-pinjam flex-fill" data-nama="${b.nama}">Pinjam →</button>
            <button class="btn btn-warning btn-sm btn-edit" data-id="${b.id}" data-nama="${b.nama}" data-stok="${b.stok}" data-bs-toggle="modal" data-bs-target="#modalEdit">Edit</button>
          </div>
        </div>
      </div>
    </div>`;
  });
  barang.forEach(b=>{ pilih.innerHTML += `<option>${b.nama}</option>`; });
}
tampilBarang();

document.getElementById("filterKategori").addEventListener("click", function(e){
  let btn = e.target.closest(".btn-filter");
  if(!btn) return;
  document.querySelectorAll(".btn-filter").forEach(b=>b.classList.remove("active"));
  btn.classList.add("active");
  filterAktif = btn.dataset.filter;
  tampilBarang(document.getElementById("cariBarang").value);
});

document.getElementById("listBarang").addEventListener("click", function(e){
  if(e.target.classList.contains("btn-pinjam")){
    document.getElementById("pilihBarang").value = e.target.dataset.nama;
    document.getElementById("pinjam").scrollIntoView({behavior:"smooth"});
  }
});

document.getElementById("cariBarang").addEventListener("input", function(){ tampilBarang(this.value); });

document.getElementById("nisn").addEventListener("input", function(){
  let benar = /^[0-9]{10}$/.test(this.value);
  document.getElementById("errorNisn").classList.toggle("d-none", benar);
});

function hitungDenda(){
  let pinjam = new Date(document.getElementById("tglPinjam").value);
  let kembali = new Date(document.getElementById("tglKembali").value);
  if(!isNaN(pinjam) && !isNaN(kembali)){
    let selisih = Math.ceil((kembali - pinjam)/(1000*60*60*24));
    let telat = selisih > 3 ? selisih - 3 : 0;
    let denda = telat * 5000;
    document.getElementById("infoDenda").textContent = "Rp " + denda.toLocaleString("id-ID");
    return denda;
  }
  return 0;
}
document.getElementById("tglKembali").addEventListener("change", hitungDenda);

document.getElementById("btnPinjam").addEventListener("click", function(){
  let nama = document.getElementById("nama").value;
  let nisn = document.getElementById("nisn").value;
  let brg = document.getElementById("pilihBarang").value;
  if(!nama || !/^[0-9]{10}$/.test(nisn)){ alert("Isi Nama & NISN 10 digit angka dulu!"); return; }
  let denda = hitungDenda();
  let dataBarang = barang.find(b=>b.nama===brg);
  if(dataBarang.stok <= 0){ alert("Stok habis!"); return; }
  dataBarang.stok--;
  let tbody = document.getElementById("tabelTransaksi");
  tbody.innerHTML += `<tr><td>${nama}</td><td>${brg}</td><td>${document.getElementById("tglPinjam").value}</td><td>${document.getElementById("tglKembali").value}</td><td class="nominal">${denda}</td><td><button class="btn btn-danger btn-sm btn-hapus">Kembalikan</button></td></tr>`;
  tampilBarang(); hitungTotal(); alert("Berhasil dipinjam!");
});

function hitungTotal(){
  let total = 0;
  document.querySelectorAll("#tabelTransaksi .nominal").forEach(td=>{ total += parseInt(td.textContent) || 0; });
  document.getElementById("totalBayar").textContent = "Rp " + total.toLocaleString("id-ID");
}
document.getElementById("tabelTransaksi").addEventListener("click", function(e){
  if(e.target.classList.contains("btn-hapus")){
    e.target.closest("tr").remove(); hitungTotal();
  }
});

document.addEventListener("click", function(e){
  let btn = e.target.closest(".btn-edit");
  if(!btn) return;
  document.getElementById("modalId").value = btn.dataset.id;
  document.getElementById("modalNama").value = btn.dataset.nama;
  document.getElementById("modalStok").value = btn.dataset.stok;
});
document.getElementById("btnSimpanEdit").addEventListener("click", function(){
  let id = document.getElementById("modalId").value;
  let item = barang.find(b=>b.id==id);
  item.nama = document.getElementById("modalNama").value;
  item.stok = parseInt(document.getElementById("modalStok").value);
  tampilBarang();
});