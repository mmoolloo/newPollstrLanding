function resizeAll(){
  inicioPie();
  //resizeBarUsers();
  resizeBarKeywords();
  //resizebarHashtags();
  resizeDonut();
  //resizeCardinal();
}

d3.select(window).on("load", resizeCardinal);

d3.select(window).on("resize", resizeAll);
