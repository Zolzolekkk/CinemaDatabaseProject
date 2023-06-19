import Price from "../model/price.js"

const getPriceList = async (req, res) => {
  try {
    const priceList = await Price.findOne({ endtime: null })
    if (!priceList) {
      throw new Error("Current priceList is not specified")
    }
    const tariff = { normal: priceList.normal, student: priceList.student }
    res.status(200).json({ priceList: tariff })
  }
  catch (err) {
    req.status(404).json({ message: err.message })
  }
}

export { getPriceList }