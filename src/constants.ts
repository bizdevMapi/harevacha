/**
 * קבועים גלובליים לאתר.
 * ייבוא לפי שם מכל מקום תחת `src/`:
 *
 * @example
 * import { SITE } from './constants'
 */

/** הגדרת שכבה ל־getLayerFeaturesByLocation — עדכן שדות לפי נספח א׳ / ממשק הניהול */
export type SpatialLayerQuery = {
  readonly name: string
  readonly fields: readonly string[]
}

export const SITE = Object.freeze({
  locale: 'he',
  layers: Object.freeze({
    municipalitiesLayer: 'layer_125',
  }),
  /**
   * ניתוח מרחבי (standalone) — govmap.getLayerFeaturesByLocation
   * @see https://api.govmap.gov.il/docs/standalone/get-layer-features-by-location
   */
  spatialAnalysis: Object.freeze({
    radiusMeters: 150,
    layers: Object.freeze<SpatialLayerQuery[]>([
      Object.freeze({
        name: 'layer_125',
        /** החלף בשמות שדות אמיתיים מהשכבה; לדוגמה: ['שם_ישוב'] וכו׳ */
        fields: Object.freeze(['OBJECTID']),
      }),
    ]),
  }),
})
