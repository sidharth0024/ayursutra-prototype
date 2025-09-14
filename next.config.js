/** @type {import('next').NextConfig} */
const nextConfig = {
experimental: {
appDir: true,
},
async headers() {
return [
{
source: '/manifest.json',
headers: [
{
key: 'Content-Type',
value: 'application/manifest+json',
},
],
},
]
},
}
module.exports = nextConfig
