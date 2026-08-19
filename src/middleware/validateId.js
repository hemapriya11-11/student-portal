export const validateId = (req, res, next) => {
  const { id } = req.params

  if (!id) {
    return res.status(400).send(
       "Student id is required"
    )
  }

  if (!Number.isInteger(Number(id)) || Number(id) <= 0) {
    return res.status(400).send(
      "Student id must be a positive integer"
    )
  }

  next()
}