import { StyleSheet } from 'react-native';
import { THEME } from '@/lib/data';

export const theme = THEME;

export const common = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: THEME.softCream,
  },
  screenPadding: {
    padding: 20,
  },
  card: {
    backgroundColor: THEME.white,
    borderRadius: 20,
    padding: 16,
    shadowColor: THEME.deepNavy,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  title: {
    fontFamily: 'Nunito_800ExtraBold',
    fontSize: 28,
    color: THEME.deepNavy,
  },
  subtitle: {
    fontFamily: 'Quicksand_600SemiBold',
    fontSize: 16,
    color: THEME.deepNavy,
    opacity: 0.7,
  },
  body: {
    fontFamily: 'Quicksand_500Medium',
    fontSize: 15,
    color: THEME.deepNavy,
    lineHeight: 22,
  },
  button: {
    backgroundColor: THEME.tropicalTeal,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: THEME.white,
  },
  buttonSecondary: {
    backgroundColor: THEME.sunshineYellow,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  buttonSecondaryText: {
    fontFamily: 'Nunito_700Bold',
    fontSize: 16,
    color: THEME.deepNavy,
  },
  input: {
    backgroundColor: THEME.white,
    borderRadius: 14,
    padding: 16,
    fontFamily: 'Quicksand_500Medium',
    fontSize: 16,
    color: THEME.deepNavy,
    borderWidth: 2,
    borderColor: '#E8E0D5',
    marginBottom: 12,
  },
});
