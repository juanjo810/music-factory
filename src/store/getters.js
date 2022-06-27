export default{
  getImageById: (state) => (id) => { return state.images.find(image => image.id === id) },
  getImagesByUser: (state) => (email) => {
    return state.images.filter(image => image.owner[0] === email)
  },
  getUser: (state) => { return state.user },
  getPosts: (state) => {
    return state.images.filter(image => image.esPublico === true)
  },
  getFivePosts: (state) => {
    var count = 0
    return state.images.filter((image) => {
      if (count < 5 && image.esPublico === true) {
        count++
        return true
      }
      return false
    }).sort(function (x, y) {
      return y.fecha.seconds - x.fecha.seconds
    })
  },
  getReports: (state) => {
    return state.images.filter(image => image.esReportado === true)
  },
  getPostsByUser: (state) => (email) => {
    return state.images.filter(image => image.esPublico === true && image.owner[0] === email)
  }
}
