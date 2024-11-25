import { Router, type Request, type Response } from 'express';
import weatherService from '../../service/weatherService';
const router = Router();

import HistoryService from '../../service/historyService.js';
import WeatherService from '../../service/weatherService.js';

// TODO: POST Request with city name to retrieve weather data
router.post('/', async (req: Request, res: Response) => {
  const { city } = req.body;

  if (!city) {
    return res.status(400).json({ error: 'City name is required'});
  }

  // TODO: GET weather data from city name
  try {
    const weatherData = await WeatherService.getWeatherForCity(city);

    await HistoryService.addToHistory(city);

    return res.status(200).json(weatherData);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch weather data' });
  }
  // TODO: save city to search history
});

// TODO: GET search history
router.get('/history', async (req: Request, res: Response) => {
  try {
    const history = await HistoryService.getHistory();
    return res.status(200).json(history);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch search history' });
  }
});

// * BONUS TODO: DELETE city from search history
router.delete('/history/:id', async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!id) {
    return res.status(400).json({ error: 'City ID is required '});
  } 
  
  try {
    await HistoryService.deleteFromHistory(id);
    return res.status(200).json({ message: 'City removed from history' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to delete city from history' });
  }
});

export default router;
