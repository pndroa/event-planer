import ejs from 'ejs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const templatePath = path.join(__dirname, 'emailTemplates', 'eventEmail.ejs')

export async function createEventEmail(
  personName: string | null = '',
  eventTitle: string
): Promise<string> {
  try {
    const view = await ejs.renderFile(templatePath, {
      name: personName,
      title: eventTitle,
    })
    return view
  } catch (err) {
    console.error(err)
    throw err
  }
}
