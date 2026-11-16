/**
 * Klasik script'lerde modüller `globalThis.CEM` ad alanına yazar.
 * Testler bu dosya üzerinden aynı kodu yükler; kopya kod yoktur.
 *
 * Sıra `index.html` ile aynıdır: her dosya kendinden öncekilere dayanır.
 */
import '../src/model-params.js'
import '../src/model.js'
import '../src/present.js'
import '../src/evidence.js'
import '../src/app.js'

const CEM = globalThis.CEM

if (!CEM) throw new Error('CEM ad alanı yüklenmedi')

export default CEM
