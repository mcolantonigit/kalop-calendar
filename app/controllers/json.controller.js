import fs from "fs/promises";

const path = "./app/resources/users.json";
const pathCronograma = "./app/resources/cronograma.json";
const pathComidas = "./app/resources/comidas.json";
const pathColores = "./app/resources/colores-interfaz.json";

const getUsuarios = async () => {
  const data = await fs.readFile(path, "utf-8");
  return JSON.parse(data);
};

const saveUsuarios = async (usuarios) => {
  await fs.writeFile(path, JSON.stringify(usuarios, null, 2));
};

const getCronograma = async () => {
  const data = await fs.readFile(pathCronograma, "utf-8");
  return JSON.parse(data);
};

const saveCronograma = async (cronograma) => {
  await fs.writeFile(pathCronograma, JSON.stringify(cronograma, null, 2));
};

const getComidas = async () => {
  const data = await fs.readFile(pathComidas, "utf-8");
  return JSON.parse(data);
};

const saveComidas = async (comidas) => {
  await fs.writeFile(pathComidas, JSON.stringify(comidas, null, 2));
};

const getColores = async () => {
  const data = await fs.readFile(pathColores, "utf-8");
  return JSON.parse(data);
};

const saveColores = async (colores) => {
  await fs.writeFile(pathColores, JSON.stringify(colores, null, 2));
};

export const methods = {
    saveUsuarios,
    getUsuarios,
    saveComidas,
    getComidas,
    saveCronograma,
    getCronograma,
    saveColores,
    getColores
}