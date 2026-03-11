import courses from '../data/courses.json'
import faq from '../data/faq.json'

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export async function getCourses() {
  await wait(150)
  return courses
}

export async function getFaq() {
  await wait(150)
  return faq
}

