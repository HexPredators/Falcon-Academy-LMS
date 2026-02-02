import fs from 'fs'
import path from 'path'

const fixExports = (filePath) => {
  try {
    const content = fs.readFileSync(filePath, 'utf8')
    
    // Fix AuthContext export
    if (filePath.includes('AuthContext.jsx')) {
      // Ensure AuthContext is exported
      if (!content.includes('export default AuthContext') && !content.includes('export { AuthContext }')) {
        const fixedContent = content.replace(
          /const AuthContext = createContext\(\)/,
          `const AuthContext = createContext()

export { AuthContext }`
        )
        fs.writeFileSync(filePath, fixedContent)
        console.log(`✅ Fixed exports in ${filePath}`)
      }
    }
    
    // Fix other common export issues
    if (content.includes('export const') && !content.includes('export default')) {
      const componentName = path.basename(filePath, '.jsx')
      if (componentName) {
        const defaultExport = `\nexport default ${componentName}`
        if (!content.includes(defaultExport)) {
          fs.appendFileSync(filePath, defaultExport)
          console.log(`✅ Added default export to ${filePath}`)
        }
      }
    }
  } catch (error) {
    console.error(`❌ Error fixing ${filePath}:`, error.message)
  }
}

const walkDir = (dir) => {
  fs.readdirSync(dir).forEach(file => {
    const filePath = path.join(dir, file)
    const stat = fs.statSync(filePath)
    
    if (stat.isDirectory()) {
      walkDir(filePath)
    } else if (file.endsWith('.jsx') || file.endsWith('.js')) {
      fixExports(filePath)
    }
  })
}

// Start fixing from src directory
const srcDir = path.join(process.cwd(), 'src')
if (fs.existsSync(srcDir)) {
  console.log('🔧 Fixing export issues...')
  walkDir(srcDir)
  console.log('✅ All exports fixed!')
} else {
  console.error('❌ src directory not found')
}