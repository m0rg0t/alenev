import OpenAI from 'openai';
import fs from 'fs-extra';
import path from 'path';
import { marked } from 'marked';
import dotenv from 'dotenv';

// Загрузка переменных окружения из файла .env
dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/**
 * Функция для копирования текущего публичного сайта в архив
 */
async function archiveCurrentSite() {
  const publicDir = path.join(process.cwd(), 'public');
  const archiveDir = path.join(publicDir, 'archive');
  
  // Проверяем, существует ли текущий index.html файл
  const indexPath = path.join(publicDir, 'index.html');
  if (await fs.pathExists(indexPath)) {
    // Создаем имя архивной папки с текущей датой
    const date = new Date();
    const dateFolderName = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}_${String(date.getHours()).padStart(2, '0')}-${String(date.getMinutes()).padStart(2, '0')}`;
    const archiveFolder = path.join(archiveDir, dateFolderName);
    
    // Создаем папку для архива, если её нет
    await fs.ensureDir(archiveFolder);
    
    // Получаем список всех файлов в public директории (кроме папки archive)
    const files = await fs.readdir(publicDir);
    
    // Копируем все файлы в архивную папку
    for (const file of files) {
      if (file !== 'archive') {
        const srcPath = path.join(publicDir, file);
        const destPath = path.join(archiveFolder, file);
        
        if ((await fs.stat(srcPath)).isFile()) {
          await fs.copy(srcPath, destPath);
        } else if ((await fs.stat(srcPath)).isDirectory()) {
          await fs.copy(srcPath, destPath);
        }
      }
    }
    
    console.log(`Текущий сайт архивирован в: ${archiveFolder}`);
  }
}

/**
 * Функция для получения содержимого README.md файла
 */
async function getReadmeContent() {
  const readmePath = path.join(process.cwd(), 'README.md');
  try {
    return await fs.readFile(readmePath, 'utf-8');
  } catch (error) {
    console.error('Ошибка при чтении README.md файла:', error);
    throw error;
  }
}

/**
 * Функция для преобразования Markdown в HTML
 */
async function convertMarkdownToHtml(markdown: string): Promise<string> {
  return await marked(markdown);
}

/**
 * Функция для генерации HTML шаблона с использованием OpenAI API
 */
async function generateHtmlTemplate(htmlContent: string) {
  try {
    const prompt = `
    Ты - эксперт по веб-разработке и дизайну. Создай современную HTML страницу для персонального сайта из предоставленного HTML контента. 
    Требования:
    1. Используй современные CSS фреймворки или чистый CSS.
    2. Создай уникальный, креативный дизайн.
    3. Обеспечь адаптивность для мобильных устройств.
    4. Используй современную цветовую схему и типографику.
    5. Добавь анимации и интерактивность где это уместно.
    6. Структурируй контент для лучшего восприятия.
    7. Включи все изображения и ссылки из исходного контента.
    8. Добавь навигационное меню для разделов.
    9. Оптимизируй для SEO.
    
    Возврати полностью готовый к использованию HTML код (включая все стили, скрипты и т.д.).
    Также можешь использовать nano и микро CSS фреймфорки наподобие Pico.css, Skeleton и т.д.
    Не используй Bootstrap или Tailwind CSS.

    Можешь делать небольшое summary в начале об Антоне Леневе.

    Вот HTML контент для преобразования:
    ${htmlContent}

    !важно! Не добавляй никаких комментариев или пояснений к коду, просто верни готовый HTML код.
    `;

    const completion = await openai.chat.completions.create({
      messages: [{ role: "system", content: prompt }],
      model: "gpt-4o"
    });

    return completion.choices[0]?.message?.content || '';
  } catch (error) {
    console.error('Ошибка при генерации HTML шаблона:', error);
    throw error;
  }
}

/**
 * Функция для сохранения сгенерированного HTML в файл
 */
async function saveHtmlToFile(html: string) {
  const publicDir = path.join(process.cwd(), 'public');
  await fs.ensureDir(publicDir);
  
  const filePath = path.join(publicDir, 'index.html');
  try {
    await fs.writeFile(filePath, html);
    console.log(`HTML сайт успешно сохранен в: ${filePath}`);
  } catch (error) {
    console.error('Ошибка при сохранении HTML файла:', error);
    throw error;
  }
}

/**
 * Функция для запуска HTTP-сервера для статических файлов
 */
async function startStaticServer(port: number = 3000) {
  const publicDir = path.join(process.cwd(), 'public');
  
  // Проверяем существование директории public
  if (!(await fs.pathExists(publicDir))) {
    console.error(`Директория '${publicDir}' не существует.`);
    return;
  }

  // Запускаем HTTP-сервер с использованием встроенного файлового сервера Bun
  const server = Bun.serve({
    routes: {
      '/': () => Response.redirect("/index.html"),
    },
    port: port,
    fetch(req) {
      const url = new URL(req.url);
      const filePath = path.join(publicDir, url.pathname);
      return new Response(Bun.file(filePath));
    },
  });
  
  console.log(`HTTP-сервер запущен: http://localhost:${port}`);
  return server;
}

/**
 * Основная функция для запуска процесса генерации сайта
 */
async function main() {
  // Проверяем аргументы командной строки
  const args = process.argv.slice(2);
  
  // Если передан аргумент --serve, запускаем HTTP-сервер
  if (args.includes('--serve')) {
    // Определяем порт из аргументов или используем 3000 по умолчанию
    const portIndex = args.indexOf('--port');
    const port = portIndex !== -1 && args[portIndex + 1] ? 
      parseInt(args[portIndex + 1], 10) : 3000;
      
    await startStaticServer(port);
    return;
  }
  
  try {
    console.log('Начинаем процесс генерации сайта...');

    // Архивируем текущий сайт
    await archiveCurrentSite();

    // Получаем содержимое README.md файла
    const readmeContent = await getReadmeContent();

    // Преобразуем Markdown в HTML
    const htmlContent = await convertMarkdownToHtml(readmeContent);

    // Генерируем красивый HTML шаблон с помощью OpenAI
    console.log('Генерируем HTML шаблон с помощью OpenAI API...');
    const generatedHtml = await generateHtmlTemplate(htmlContent);

    // Сохраняем результат в файл
    await saveHtmlToFile(generatedHtml);

    console.log('Процесс генерации сайта успешно завершен!');
    
    // Если указан аргумент --serve-after-generate, запускаем HTTP-сервер после генерации
    if (args.includes('--serve-after-generate')) {
      const portIndex = args.indexOf('--port');
      const port = portIndex !== -1 && args[portIndex + 1] ? 
        parseInt(args[portIndex + 1], 10) : 3000;
        
      await startStaticServer(port);
    }
  } catch (error) {
    console.error('Произошла ошибка в процессе генерации сайта:', error);
  }
}

// Запуск основной функции
main();