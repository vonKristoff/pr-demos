import Commonjs from 'rollup-plugin-commonjs'
import Resolve from 'rollup-plugin-node-resolve'
import Buble from 'rollup-plugin-buble'
import { uglify } from 'rollup-plugin-uglify'
import { eslint } from 'rollup-plugin-eslint'
import replace from 'rollup-plugin-replace'
import html from 'rollup-plugin-html'
import json from 'rollup-plugin-json'
import lintrc from './.eslintrc.json'

const format = 'iife'                                           // runtime: browser
const input = 'js/main.js'                                      // input
const file = 'public/bundle.js'                                 // target output
const name = process.env.npm_package_name.split("-").join("")   // making it namesafe for JS
const sourcemap = process.env.NODE_ENV === 'development'

export default {
    input,    
    plugins: [
        Resolve({ jsnext: true }),        
        html({ include: 'js/components/templates/*.html' }),
        json({ include: 'js/*.json' }),
        eslint(lintrc),  
        Buble({
            transforms: {                
                classes: true,
                arrow: true,
                modules: false,
                dangerousForOf: true
            },
            objectAssign: "Object.assign"                       // required as a spread operator helper
        }),
        Commonjs({ include: 'node_modules/**' }),
        replace({ exclude: 'node_modules/**', ENV: JSON.stringify(process.env.NODE_ENV || 'development') }),        
        (process.env.NODE_ENV === 'production' && uglify())
    ],
    output: { format, name, file, sourcemap }
}