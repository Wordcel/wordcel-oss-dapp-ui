export const toasterPromise = (request: any) => (
  new Promise((resolve, reject) => {
    request.then((res: any) => {
      if (res.status === 200) {
        resolve(res)
      } else {
        reject(res)
      }
    })
  })
)