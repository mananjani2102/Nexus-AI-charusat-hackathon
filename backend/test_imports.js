try {
  require('./utils/htmlTextMapper');
  console.log('htmlTextMapper OK');
  require('./routes/rewrite');
  console.log('rewrite.js OK');
  console.log('All imports successful!');
} catch(e) {
  console.error('ERROR:', e.message);
  console.error(e.stack);
}
