export type Vector3 = { x: number; y: number; z: number }

const TAU = Math.PI * 2

// Decorative molecular studies, not measured structures or a folding simulation.
function helix(t: number): Vector3 {
  const angle = t * TAU * 3.4
  return { x: 0.46 * Math.cos(angle), y: 1 - t * 2, z: 0.46 * Math.sin(angle) }
}

function foldedChain(t: number): Vector3 {
  const angle = t * TAU
  return {
    x: (Math.sin(angle * 2) + 0.4 * Math.sin(angle * 5)) * 0.55,
    y: (Math.cos(angle * 3) + 0.35 * Math.cos(angle * 7)) * 0.6,
    z: (Math.sin(angle * 3) + 0.45 * Math.cos(angle * 2)) * 0.5,
  }
}

function normalize(v: Vector3): Vector3 {
  const length = Math.hypot(v.x, v.y, v.z) || 1
  return { x: v.x / length, y: v.y / length, z: v.z / length }
}

function cross(a: Vector3, b: Vector3): Vector3 {
  return { x: a.y * b.z - a.z * b.y, y: a.z * b.x - a.x * b.z, z: a.x * b.y - a.y * b.x }
}

function tubeRing(curve: (t: number) => Vector3, t: number, radius: number, count: number): Vector3[] {
  const center = curve(t)
  const before = curve(t - 0.001)
  const after = curve(t + 0.001)
  const tangent = normalize({ x: after.x - before.x, y: after.y - before.y, z: after.z - before.z })
  const reference = Math.abs(tangent.y) < 0.9 ? { x: 0, y: 1, z: 0 } : { x: 1, y: 0, z: 0 }
  const normal = normalize(cross(tangent, reference))
  const binormal = cross(tangent, normal)

  return Array.from({ length: count }, (_, index) => {
    const angle = (index / count) * TAU
    const a = Math.cos(angle) * radius
    const b = Math.sin(angle) * radius
    return {
      x: center.x + normal.x * a + binormal.x * b,
      y: center.y + normal.y * a + binormal.y * b,
      z: center.z + normal.z * a + binormal.z * b,
    }
  })
}

export function createMolecularPoints(compact: boolean) {
  const segments = compact ? 130 : 180
  const ringSize = compact ? 6 : 8
  const points: { helix: Vector3; protein: Vector3 }[] = []

  for (let segment = 0; segment < segments; segment++) {
    const t = segment / (segments - 1)
    const coil = tubeRing(helix, t, 0.065, ringSize)
    const fold = tubeRing(foldedChain, t, 0.075, ringSize)
    for (let index = 0; index < ringSize; index++) {
      points.push({ helix: coil[index], protein: fold[index] })
    }
  }

  return points
}

export function molecularBlend(elapsed: number) {
  const phase = elapsed % 28
  const smooth = (t: number) => t * t * (3 - 2 * t)
  if (phase < 10) return 0
  if (phase < 14) return smooth((phase - 10) / 4)
  if (phase < 24) return 1
  return 1 - smooth((phase - 24) / 4)
}
