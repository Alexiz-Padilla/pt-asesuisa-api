const setPrefix = (age, genderId, isMarried) => {
  let pi_prefix = "";
  if (age < 35 && genderId === "5ec7b279cd15535fe4e60165") {
    pi_prefix = "Joven";
  } else if (age >= 35 && genderId === "5ec7b279cd15535fe4e60165") {
    pi_prefix = "Sr.";
  } else if (!isMarried && genderId === "5ec7b29ccd15535fe4e60166"){
    pi_prefix = "Srita.";
  } else if (isMarried && genderId === "5ec7b29ccd15535fe4e60166"){
      pi_prefix = "Sra.";
  }

  return pi_prefix;
}

module.exports = { setPrefix };
