(function() {
  const now = new Date;
  const month = now.getMonth() + 1;
  const day = now.getDate();

  const isQingming = month === 4 && (day === 4 || day === 5);
  const isNationalMemorialDay = month === 12 && day === 13;
  const isWenchuan = month === 5 && day === 12;
  const isMarcoPoloBridge = month === 7 && day === 7;
  const isMukden = month === 9 && day === 18;
  const isMartyrsDay = month === 9 && day === 30;
  const isJapanSurrender = month === 8 && day === 15;
  const isZhouEnlaiDeath = month === 1 && day === 8;
  const isDengXiaopingDeath = month === 2 && day === 19;
  const isMaoDeath = month === 9 && day === 9;

  if (isQingming || isNationalMemorialDay || isWenchuan || isMarcoPoloBridge || isMukden || isMartyrsDay || isJapanSurrender || isMaoDeath || isZhouEnlaiDeath || isDengXiaopingDeath) {
    document.documentElement.style.filter = 'grayscale(100%)';
  }
})();