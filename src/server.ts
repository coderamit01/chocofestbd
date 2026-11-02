import express from 'express'


const app = express()
const port = 5000

async function main() {
  try {
    app.listen(port, () => {
      console.log(`Server running on port ${port}`)
    })
  } catch (error) {
    console.log("Something went wrong");
  }

}

