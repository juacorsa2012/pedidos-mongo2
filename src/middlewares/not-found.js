const notFound = (req, res) => res.status(404).send({
  success: false,
  message: 'No se ha encontrado la ruta solicitada'
})

export default notFound