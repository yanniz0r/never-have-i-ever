export enum Color {
  Red,
  Blue,
  Green,
  Purple,
  Yellow,
  Pink,
}

export const colorForString = (str: string): Color => {
  const numberOfColors = Object.keys(Color).length / 2;
  const colorIndex = str.charCodeAt(0) % numberOfColors;
  return Color[Object.values(Color)[colorIndex]]
}

export const twBackgroundClassForColor = (color: Color) => {
  switch(color) {
    case Color.Blue:
      return 'bg-blue-500'
    case Color.Green:
      return 'bg-green-500'
    case Color.Pink:
      return 'bg-pink-500'
    case Color.Purple:
      return 'bg-purple-500'
    case Color.Red:
      return 'bg-red-500'
    case Color.Yellow:
      return 'bg-yellow-500'
  }
}
