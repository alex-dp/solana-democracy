/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  output: "export"
}

const withPWA = require('next-pwa')({
  dest: 'public'
})

module.exports = withPWA(nextConfig)
