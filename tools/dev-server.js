import browserSync from 'browser-sync';
import path from 'path';
const devServer = browserSync.create('dev');

devServer.init({
  server: path.join(__dirname, './'),
});

devServer.watch('*.html').on('change', devServer.reload);
devServer.watch('*.js').on('change', devServer.reload);
devServer.watch('*.json').on('change', devServer.reload);

devServer.watch('*.css', function(event, file) {
    if (event === 'change') {
        devServer.reload('*.css');
    }
});
